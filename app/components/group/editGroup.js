import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { Colors } from '@theme';
import { Wrapper, Loading, RoundedButton, ConfirmModal } from '@components/common';
import ParticipantAvatar from '@components/group/participantAvatar';
import ToolBar from '@components/utils/toolbar';
import { withGroupMembers, withUpdateGroup, withDeleteGroup } from '@services/apollo/group';
import ImagePicker from 'react-native-image-picker';
import { GROUP_NAME_LIMIT, STRETCH_TYPE_ROUTE, OPEN_GROUP, CLOSE_GROUP } from '@config/constant';
import Radio from '@components/add/radio';
import SectionLabel from '@components/add/sectionLabel';
import CommentBox from '@components/add/commentBox';
import Route from '@components/offer/route';
import Area from '@components/group/outreach/area';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';

const Enablers = withGroupMembers(ParticipantAvatar);

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: 'SFUIText-Regular',
    fontSize: 16,
    lineHeight: 28,
    color: Colors.text.black,
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 8,
    width: 150,
  },
  nameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 36,
  },
  avatar: {
    marginLeft: 20,
    marginRight: 32,
  },
  horizontalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  imageWrapper: {
    marginRight: 30,
    marginLeft: 30,
  },
  profileImage: {
    height: 62,
    width: 62,
    resizeMode: 'cover',
    borderRadius: 31,
  },
  label: {
    paddingHorizontal: 24,
    marginVertical: 8,
    color: Colors.text.gray,
  },
  radioRow: {
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  radio: {
    marginBottom: 24,
  },
  buttonWrapper: {
    padding: 16,
    backgroundColor: Colors.background.fullWhite,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
    alignItems: 'center',
  },
  button: {
    maxWidth: 200,
  },
});

class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedImage: '',
      updatedGroup: {},
      modalVisibility: false,
      loading: false,
      confirmModal: false,
      updated: false,
      error: false,
      errorMsg: '',
      openedComponent: '',
    };
  }

  componentWillMount() {
    const { group, subscribeToGroup } = this.props;
    this.setState({ updatedGroup: group });

    subscribeToGroup(group.id);
  }

  componentWillReceiveProps({ group }) {
    this.setState({ updatedGroup: group });
  }

  onComplete = () => {
    const { updateGroup, group } = this.props;
    const {
      outreach,
      TripStart,
      TripEnd,
      Stops,
      name,
      description,
      photo,
      countryCode,
      countyId,
      municipalityId,
      localityId,
      type,
      id,
    } = this.state.updatedGroup;

    if (name === '') {
      this.onChangePress(false, '');
      this.updateGroup('name', group.name);
      this.setState({ errorMsg: getToast(['GROUP_NAME_REQUIRED']) });
    } else if (description === '') {
      this.onChangePress(false, '');
      this.updateGroup('description', group.description);
      this.setState({ errorMsg: getToast(['DESCRIPTION_REQUIRED']) });
    } else if (this.state.updated) {
      this.setState({ loading: true });
      updateGroup({
        outreach,
        tripStart: TripStart.name ?
          {
            name: TripStart.name,
            coordinates: TripStart.coordinates,
            countryCode: TripStart.countryCode,
          }
          : null,
        tripEnd: TripEnd.name ?
          {
            name: TripEnd.name,
            coordinates: TripEnd.coordinates,
            countryCode: TripEnd.countryCode,
          }
          : null,
        stops: Stops.length > 0 ?
          Stops.map(stop => ({
            name: stop.name,
            coordinates: stop.coordinates,
            countryCode: stop.countryCode,
          })) : null,
        name,
        description,
        photo,
        countryCode,
        countyId,
        municipalityId,
        localityId,
        type,
        id,
      })
        .then(() => {
          this.onChangePress(false, '');
          this.setState({ loading: false, updated: false });
        })
        .catch(() => {
          this.onChangePress(false, '');
          this.setState({ loading: false, updated: false });
        });
    } else {
      this.onChangePress(false, '');
      this.setState({ loading: false, updated: false });
    }
  }

  onChangePress = (show, redirect) => {
    const { navigation, group } = this.props;

    if (redirect === 'Enablers') {
      navigation.navigate('EnablerList', { group });
    } else if (redirect === 'Participants') {
      navigation.navigate('Participants', { group });
    } else {
      this.setState({ modalVisibility: show, openedComponent: redirect });
    }
  }

  canUserDelete = () => {
    const { user } = this.props;
    const { updatedGroup } = this.state;

    if (updatedGroup.User.id === user.id && !(updatedGroup.hasCreatorLeft)) {
      return true;
    }

    if (updatedGroup.isAdmin && updatedGroup.hasCreatorLeft) {
      return true;
    }

    return false;
  }

  selectPhotoTapped = () => {
    const options = {
      quality: 0.6,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        //
      } else if (response.error) {
        //
      } else if (response.customButton) {
        //
      } else {
        let source;
        if (Platform.OS === 'android') {
          source = { uri: response.uri, isStatic: true };
        } else {
          source = { uri: response.uri.replace('file://', ''), isStatic: true };
        }
        this.setState({ uploadedImage: source });
        this.updateGroup('photo', response.data);
        this.onComplete();
      }
    });
  }

  updateGroup = (key, value) => {
    const { updatedGroup } = this.state;
    const group = { ...updatedGroup };

    if (key in updatedGroup) {
      if (updatedGroup[key] === value) {
        this.setState({ updated: false });
      } else {
        this.setState({ updated: true });
      }
      group[key] = value;
    }

    this.setState({ updatedGroup: group });
  }

  deleteGroup = () => {
    const { updatedGroup: { id } } = this.state;
    this.setState({ loading: true });

    this.props.deleteGroup({ id })
      .then(() => {
        this.setState({ confirmModal: false, loading: false, error: false });
      })
      .catch(() => this.setState({ confirmModal: true, loading: false, error: true }));
  }

  updateOutreach = async (value) => {
    const { updatedGroup: { outreach } } = this.state;

    if (outreach === STRETCH_TYPE_ROUTE) {
      const { start, end, stops } = value;

      await this.updateGroup('TripStart', start);
      await this.updateGroup('TripEnd', end);
      await this.updateGroup('Stops', stops);
    } else {
      const { country, county, municipality, locality } = value;

      await this.updateGroup('countryCode', country);
      await this.updateGroup('countyId', county);
      await this.updateGroup('municipalityId', municipality);
      await this.updateGroup('localityId', locality);
    }

    this.onComplete();
  }

  renderInfoEdit = () => {
    const { updatedGroup: { name } } = this.state;

    return (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <View style={styles.inputWrapper}>
          <TextInput
            onChangeText={text => this.updateGroup('name', text)}
            style={styles.input}
            defaultValue={name}
            autoCorrect={false}
            placeholderTextColor="#666"
            underlineColorAndroid="transparent"
            returnKeyType="done"
            maxLength={GROUP_NAME_LIMIT}
            multiline={false}
            onBlur={() => this.onComplete()}
          />
        </View>
        <View style={styles.horizontalDivider} />
      </View>
    );
  }

  renderAboutForm = () => {
    const { updatedGroup: { description } } = this.state;

    return (
      <CommentBox
        label={trans('group.what_is_your_group_about')}
        onChangeText={text => this.updateGroup('description', text)}
        value={description}
      />
    );
  }

  renderTypeForm = () => {
    const { updatedGroup: { type } } = this.state;

    return (
      <View style={{ paddingTop: '5%' }}>
        <SectionLabel label={trans('group.is_your_group_open_or_closed')} />
        <View style={styles.radioRow}>
          <Radio
            active={type === OPEN_GROUP}
            label={trans('group.open')}
            onPress={() => this.updateGroup('type', OPEN_GROUP)}
            style={styles.radio}
          />
          <Radio
            active={type === CLOSE_GROUP}
            label={trans('group.closed')}
            onPress={() => this.updateGroup('type', CLOSE_GROUP)}
          />
        </View>
      </View>
    );
  }

  renderOutreachForm = () => {
    const {
      updatedGroup: {
        outreach, TripStart, TripEnd, Stops, localityId, countryCode, countyId, municipalityId,
      },
      loading,
    } = this.state;

    if (loading) {
      return <Loading />;
    }

    if (outreach === STRETCH_TYPE_ROUTE) {
      const route = {
        start: TripStart ? {
          name: TripStart.name,
          countryCode: TripStart.countryCode,
          coordinates: TripStart.coordinates,
        } : {},
        end: TripEnd ? {
          name: TripEnd.name,
          countryCode: TripEnd.countryCode,
          coordinates: TripEnd.coordinates,
        } : {},
        stops: Stops ? Stops.map(stop => ({
          name: stop.name,
          countryCode: stop.countryCode,
          coordinates: stop.coordinates,
        })) : [],
      };

      return (
        <Route
          isOffer
          hideReturnTripOption
          defaultValue={route}
          buttonLabel={trans('global.done')}
          onNext={this.updateOutreach}
        />
      );
    }

    const area = {
      country: countryCode,
      county: countyId,
      municipality: municipalityId,
      locality: localityId,
    };

    return (<Area defaultValue={area} onNext={this.updateOutreach} buttonLabel={trans('global.done')} />);
  }

  renderButton = () => {
    const { loading, openedComponent } = this.state;

    if (openedComponent === 'Outreach') return null;

    if (loading) return <Loading />;

    return (
      <View style={styles.buttonWrapper}>
        <RoundedButton
          onPress={() => this.onComplete()}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          {trans('global.done')}
        </RoundedButton>
      </View>
    );
  }

  renderModal = () => {
    const { modalVisibility, openedComponent } = this.state;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={() => this.onChangePress(false, '')}
        visible={modalVisibility}
      >
        <View style={{ flex: 1 }}>
          <ToolBar
            title={openedComponent}
            onBack={() => this.onChangePress(false, '')}
          />
          <ScrollView showsVerticalIndicator={false}>
            {openedComponent === 'About' && this.renderAboutForm()}
            {openedComponent === 'Type' && this.renderTypeForm()}
            {openedComponent === 'Outreach' && this.renderOutreachForm()}
          </ScrollView>
          {openedComponent !== 'Outreach' && this.renderButton()}
        </View>
      </Modal>
    );
  }

  renderConfirmModal = () => {
    const { confirmModal, loading, error } = this.state;

    const message = (
      <AppText>{trans('group.are_you_sure_you_want_to_delete_the_group')}</AppText>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModal}
        onRequestClose={() => this.setState({ confirmModal: false })}
        message={message}
        confirmLabel={error ? trans('global.retry') : trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={this.deleteGroup}
        onDeny={() => this.setState({ confirmModal: false })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderList = ({ count, title, info, status, subtext, redirect, avatars = null }) => (
    <View style={styles.row}>
      <View style={{ flex: 1, marginRight: 16 }}>
        <AppText style={{ marginVertical: 6 }}>
          {count && `${count}`}{title} {status && (<AppText fontVariation="semibold"> - {status}</AppText>)}
        </AppText>
        {info && info !== '' && <AppText style={{ marginVertical: 6 }}>{info}</AppText>}
        {subtext && <AppText color={Colors.text.gray} style={{ marginVertical: 6 }}>
          {subtext}</AppText>}
        {avatars}
      </View>
      {
        redirect && redirect !== 'Delete' &&
        <TouchableOpacity
          style={styles.action}
          onPress={() => this.onChangePress(true, redirect)}
        >
          <AppText color={Colors.text.blue}>{trans('global.change')}</AppText>
        </TouchableOpacity>
      }
    </View >
  );

  renderEdit = () => {
    const { uploadedImage, updatedGroup, errorMsg } = this.state;
    const image = uploadedImage || { uri: updatedGroup.photo };

    return (
      <View style={{ flex: 1 }}>
        <ToolBar title={trans('global.change')} />
        <Toast message={errorMsg} type="error" />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingBottom: 50 }}>
          <View style={styles.nameSection}>
            <TouchableOpacity style={styles.imageWrapper} onPress={this.selectPhotoTapped}>
              <Image
                style={styles.profileImage}
                source={image}
              />
            </TouchableOpacity>
            {this.renderInfoEdit()}
          </View>
          {
            this.renderList({
              title: 'About',
              info: updatedGroup.description !== '' ? updatedGroup.description : null,
              redirect: 'About',
            })
          }
          {
            this.renderList({
              title: 'Area',
              info: updatedGroup.outreach === STRETCH_TYPE_ROUTE ?
                `${updatedGroup.TripStart.name} - ${updatedGroup.TripEnd.name}` :
                `${updatedGroup.locality}, ${updatedGroup.county}`,
              subtext: updatedGroup.outreach === STRETCH_TYPE_ROUTE ? null : updatedGroup.country,
              redirect: 'Outreach',
            })
          }
          {
            this.renderList({
              title: updatedGroup.type === OPEN_GROUP ? trans('group.open_group') : trans('group.closed_group'),
              subtext: updatedGroup.type === OPEN_GROUP ? trans('group.open_for_everyone_to_join') : trans('group.need_to_ask_to_join'),
              redirect: 'Type',
            })
          }
          {
            this.renderList({
              title: trans('group.Enablers'),
              avatars: (<Enablers
                id={updatedGroup.id}
                onPress={() => { }}
                offset={0}
                enabler
                displayNumber={false}
              />),
              redirect: 'Enablers',
            })
          }
          {
            this.renderList({
              title: `${updatedGroup.totalParticipants} ${updatedGroup.totalParticipants > 1 ? 'participants' : 'participant'}`,
              redirect: 'Participants',
            })
          }
          {
            this.canUserDelete() &&
            this.renderList({
              title: <AppText
                color={Colors.text.red}
                onPress={() => this.setState({ confirmModal: true })}
              >
                {trans('group.delete_the_group')}
              </AppText>,
              redirect: 'Delete',
            })
          }
          {this.renderModal()}
          {this.renderConfirmModal()}
        </ScrollView>
      </View>
    );
  }

  render() {
    const { updatedGroup } = this.state;

    return (
      <Wrapper bgColor={Colors.background.fullWhite}>
        {!updatedGroup.isDeleted && this.renderEdit()}
      </Wrapper>
    );
  }
}

EditGroup.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    photo: PropTypes.string,
    mapPhoto: PropTypes.string,
    Enablers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        avatar: PropTypes.string,
      }),
    ),
    totalParticipants: PropTypes.number,
    outreach: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  updateGroup: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  deleteGroup: PropTypes.func.isRequired,
  subscribeToGroup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withNavigation,
  withUpdateGroup,
  withDeleteGroup,
  connect(mapStateToProps),
)(EditGroup);
