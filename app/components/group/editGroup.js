import React, { Component } from 'react';
import {
  View,
  Text,
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

const Enablers = withGroupMembers(ParticipantAvatar);

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 28,
    color: Colors.text.black,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
    color: Colors.text.black,
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingTop: 8,
    width: 150,
  },
  lightText: {
    color: Colors.text.gray,
  },
  bold: {
    fontWeight: '600',
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
  actionLabel: {
    fontSize: 16,
    color: Colors.text.blue,
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
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  label: {
    paddingHorizontal: 24,
    marginVertical: 8,
    color: Colors.text.gray,
  },
  formInput: {
    flex: 1,
    height: 54,
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 24,
    fontSize: 14,
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 16,
  },
  radioRow: {
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  radio: {
    marginBottom: 24,
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
    };
  }

  componentWillMount() {
    const { group } = this.props;
    this.setState({ updatedGroup: group });
  }

  componentWillReceiveProps({ group }) {
    this.setState({ updatedGroup: group });
  }

  onComplete = () => {
    const { updateGroup } = this.props;
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
        this.setState({ loading: false });
      })
      .catch(() => {
        this.onChangePress(false, '');
        this.setState({ loading: false });
      });
  }

  onChangePress = (show, redirect) => {
    const { navigation, group } = this.props;

    if (redirect === 'enablers') {
      navigation.navigate('EnablerList', { group });
    } else if (redirect === 'participants') {
      navigation.navigate('Participants', { group });
    } else {
      this.setState({ modalVisibility: show, openedComponent: redirect });
    }
  }

  canUserDelete = () => {
    const { user } = this.props;
    const { updatedGroup } = this.state;

    if (updatedGroup.isAdmin &&
      (!(updatedGroup.hasCreatorLeft)
        || (updatedGroup.User.id === user.id))
    ) {
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
      group[key] = value;
    }

    this.setState({ updatedGroup: group });
  }

  deleteGroup = () => {
    const { navigation } = this.props;
    const { updatedGroup: { id } } = this.state;
    this.setState({ loading: true });

    this.props.deleteGroup({ id })
      .then(() => {
        this.setState({ confirmModal: false });
        navigation.navigate('Feed');
      });
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
      <View>
        <CommentBox
          label="What is your group about?"
          onChangeText={text => this.updateGroup('description', text)}
          value={description}
        />
      </View>
    );
  }

  renderTypeForm = () => {
    const { updatedGroup: { type } } = this.state;

    return (
      <View style={{ paddingTop: '5%' }}>
        <SectionLabel label="Is your group open or closed?" />
        <View style={styles.radioRow}>
          <Radio
            active={type === OPEN_GROUP}
            label="Open"
            onPress={() => this.updateGroup('type', OPEN_GROUP)}
            style={styles.radio}
          />
          <Radio
            active={type === CLOSE_GROUP}
            label="Closed"
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
        <ScrollView>
          <Route
            isOffer
            hideReturnTripOption
            defaultValue={route}
            buttonLabel={'Done'}
            onNext={this.updateOutreach}
          />
        </ScrollView>
      );
    }

    const area = {
      country: countryCode,
      county: countyId,
      municipality: municipalityId,
      locality: localityId,
    };

    return (<Area defaultValue={area} onNext={this.updateOutreach} buttonLabel={'Done'} />);
  }

  renderButton = () => {
    const { loading } = this.state;

    if (loading) return <Loading />;

    return (
      <RoundedButton
        onPress={() => this.onComplete()}
        bgColor={Colors.background.pink}
        style={styles.button}
      >
        Done
      </RoundedButton>
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
        {openedComponent === 'about' && this.renderAboutForm()}
        {openedComponent === 'type' && this.renderTypeForm()}
        {openedComponent === 'outreach' && this.renderOutreachForm()}
        {openedComponent !== 'outreach' && this.renderButton()}
      </Modal>
    );
  }

  renderConfirmaModal = () => {
    const { confirmModal, loading } = this.state;

    const message = (
      <Text>
        Are you sure you want to delete the group?
      </Text>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModal}
        onRequestClose={() => this.setState({ confirmModal: false })}
        message={message}
        confirmLabel={'Yes'}
        denyLabel="No"
        onConfirm={this.deleteGroup}
        onDeny={() => this.setState({ confirmModal: false })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderList = ({ count, title, info, status, subtext, redirect, avatars = null }) => (
    <View style={styles.row}>
      <View>
        <Text style={styles.text}>
          {count && `${count}`}{title} {status && (<Text style={styles.bold}> - {status}</Text>)}
        </Text>
        {info && <Text style={styles.text}>{info}</Text>}
        {subtext && <Text style={[styles.text, styles.lightText]}>{subtext}</Text>}
        {avatars}
      </View>
      {
        redirect && redirect !== 'delete' &&
        <TouchableOpacity
          style={styles.action}
          onPress={() => this.onChangePress(true, redirect)}
        >
          <Text style={styles.actionLabel}>Change</Text>
        </TouchableOpacity>
      }
    </View >
  );

  render() {
    const { uploadedImage, updatedGroup } = this.state;
    const image = uploadedImage || { uri: updatedGroup.photo };

    return (
      <Wrapper bgColor={Colors.background.fullWhite}>
        <ToolBar title="Change" />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingBottom: 50 }}>
          <View style={[styles.nameSection]}>
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
              info: updatedGroup.description,
              redirect: 'about',
            })
          }
          {
            this.renderList({
              title: 'Area',
              info: updatedGroup.outreach === STRETCH_TYPE_ROUTE ?
                `${updatedGroup.TripStart.name} - ${updatedGroup.TripEnd.name}` :
                `${updatedGroup.locality}, ${updatedGroup.county}`,
              subtext: updatedGroup.outreach === STRETCH_TYPE_ROUTE ? null : updatedGroup.country,
              redirect: 'outreach',
            })
          }
          {
            this.renderList({
              title: updatedGroup.type === OPEN_GROUP ? 'Open group' : 'Closed group',
              subtext: updatedGroup.type === OPEN_GROUP ? 'Open for everyone to join' : 'Need to ask to join',
              redirect: 'type',
            })
          }
          {
            this.renderList({
              title: 'Enablers',
              avatars: (<Enablers
                id={updatedGroup.id}
                onPress={() => { }}
                offset={0}
                enabler
                displayNumber={false}
              />),
              redirect: 'enablers',
            })
          }
          {
            this.renderList({
              title: `${updatedGroup.totalParticipants} ${updatedGroup.totalParticipants > 1 ? 'participants' : 'participant'}`,
              redirect: 'participants',
            })
          }
          {
            this.canUserDelete() &&
            this.renderList({
              title: <Text
                onPress={() => this.setState({ confirmModal: true })}
              >
                Delete the group
              </Text>,
              redirect: 'delete',
            })
          }
          {this.renderModal()}
          {this.renderConfirmaModal()}
        </ScrollView>
      </Wrapper>
    );
  }
}

EditGroup.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    photo: PropTypes.string,
    mapPhoto: PropTypes.string,
    Enablers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
    totalParticipants: PropTypes.number.isRequired,
    outreach: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  updateGroup: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  deleteGroup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withNavigation,
  withUpdateGroup,
  withDeleteGroup,
  connect(mapStateToProps),
)(EditGroup);
