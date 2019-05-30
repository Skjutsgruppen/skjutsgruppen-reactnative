import React, { Component } from 'react';
import { View, StyleSheet, Clipboard, BackHandler, Keyboard, Alert, Platform, PermissionsAndroid, ImageStore } from 'react-native';
import Stretch from '@components/group/stretch';
import About from '@components/group/about';
import OpenClosed from '@components/group/openClosed';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { submitGroup } from '@services/apollo/group';
import Share from '@components/common/share';
import Completed from '@components/common/completed';
import { Loading, Wrapper, Container, ProgressBar, AppNotification } from '@components/common';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { FEEDABLE_GROUP, OPEN_GROUP, STRETCH_TYPE_ROUTE, DEFAULT_COUNTRY_CODE } from '@config/constant';
import ToolBar from '@components/utils/toolbar';
import { trans } from '@lang/i18n';
import { Heading } from '@components/utils/texts';
import { APP_URL } from '@config';
import ErrorIcon from '@assets/icons/ic_warning.png';
import FBShare from '@services/facebook/share';
import sms from '@components/utils/smsHelper';

const styles = StyleSheet.create({
  progress: {
    paddingHorizontal: 20,
  },
  stepsCount: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
});

class Group extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      strech: {
        outreach: STRETCH_TYPE_ROUTE,
        route: {
          direction: null,
          start: {
            name: '',
            countryCode: '',
            coordinates: [],
          },
          end: {
            name: '',
            countryCode: '',
            coordinates: [],
          },
          stops: [{
            name: '',
            countryCode: '',
            coordinates: [],
          }],
          stopsCount: 1,
          isReturning: false,
          currentLocationSelected: '',
        },
        area: {
          country: DEFAULT_COUNTRY_CODE,
          county: null,
          municipality: null,
          locality: null,
        },
      },
      about: {
        name: '',
        description: '',
        photo: '',
        uri: '',
      },
      type: OPEN_GROUP,
      share: {},
      shareSearchInputFocused: false,
      activeStep: 1,
      loading: false,
      group: {},
      error: '',
      notification: false,
    };
    this.container = null;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { activeStep, loading } = this.state;
    const { navigation } = this.props;

    if (activeStep === 1) {
      Alert.alert(
        '',
        'Are you sure You want to exit this screen?',
        [
          { text: 'Cancel', onPress: () => { }, style: 'cancel' },
          { text: 'OK', onPress: () => navigation.goBack() },
        ],
        { cancelable: true },
      );
      return true;
    }

    if (activeStep === 5) {
      if (!loading) {
        navigation.goBack();
      }
      return true;
    }

    if (activeStep > 1) {
      this.setState({ activeStep: activeStep - 1 }, this.scrollToTop);
      return true;
    }

    return false;
  }

  onStrechNext = ({ outreach, trip }) => {
    let { area, route } = this.state.strech;
    let error = 0;
    if (outreach === 'area') {
      if (trip.country === '') {
        this.setState({ error: getToast(['COUNTRY_REQUIRED']), notification: true }, this.scrollToTop);
        error += 1;
      } else if (trip.country === 'SE' && trip.municipality === '') {
        this.setState({ error: getToast(['MUNICIPALITY_REQUIRED']), notification: true }, this.scrollToTop);
        error += 1;
      }

      area = trip;
    }

    if (outreach === 'route') {
      if (trip.start.coordinates.length === 0 && trip.end.coordinates.length === 0) {
        this.setState({ error: getToast(['EITHER_FROM_TO_REQUIRED']), notification: true }, this.scrollToTop);
        error += 1;
      }

      if (trip.start.coordinates.length === 0 || trip.end.coordinates.length === 0) {
        trip.direction = 'anywhere';
      }

      if (trip.directionFrom) trip.direction = trip.directionFrom;
      if (trip.directionTo) trip.direction = trip.directionTo;

      route = trip;
    }

    if (error === 0) {
      this.setState({ strech: { outreach, route, area }, activeStep: 2, error: '' }, this.scrollToTop);
    }
  }

  onAboutNext = (about) => {
    if (about.photo === '') {
      this.setState({ error: getToast(['GROUP_PHOTO_REQUIRED']), notification: true }, this.scrollToTop);
    } else if (about.name === '') {
      this.setState({ error: getToast(['GROUP_NAME_REQUIRED']), notification: true }, this.scrollToTop);
    } else if (about.description === '') {
      this.setState({ error: getToast(['DESCRIPTION_REQUIRED']), notification: true }, this.scrollToTop);
    } else {
      this.setState({ about, activeStep: 3, error: '' }, this.scrollToTop);
    }
  }

  onTypeNext = (type) => {
    this.setState({ type, activeStep: 4 });
  }

  onCloseNotification = () => {
    this.setState({ notification: false });
  }

  onShareAndPublish = (share) => {
    this.setState({ share, activeStep: 5, loading: true }, this.createGroup);
  }

  onShareSearchInputStateChange = focused => this.setState({ shareSearchInputFocused: focused });

  scrollToTop = () => {
    const { activeStep } = this.state;
    Keyboard.dismiss();
    if (activeStep !== 4) {
      setTimeout(() => {
        this.container.scrollTo({ x: 0, y: 0, animated: true });
      }, 0);
    }
  }

  createGroup() {
    const { strech, about, type, share } = this.state;
    const { outreach, route, area } = strech;

    try {
      this.props.submit(
        outreach,
        route.start,
        route.end,
        route.stops,
        about.name,
        about.description,
        about.photo,
        area.country,
        area.county,
        area.municipality,
        area.locality,
        type,
        { social: share.social, friends: share.friends, groups: share.groups },
        route.direction,
      )
        .then(async (res) => {
          ImageStore.removeImageForTag(about.uri);
          if (share.clipboard.indexOf('copy_to_clip') > -1) {
            Clipboard.setString(res.data.group.url);
          }

          if (share.contacts && share.contacts.length > 0) {
            const { contacts } = share;
            const { name, id } = res.data.group;
            const smsBody = trans('share.share_group', { name, url: `${APP_URL}/g/${id}` });
            sms(smsBody, contacts);
          }

          if (share.social && share.social.length > 0 && share.social.includes('Facebook')) {
            FBShare.link(FEEDABLE_GROUP, res.data.group);
          }

          this.setState({ loading: false, group: res.data.group, error: '' });
        }).catch((err) => {
          console.warn(err);
          this.setState({ loading: false, error: getToast(err) });
        });
    } catch (err) {
      console.warn(err);
      this.setState({ loading: false, error: getToast(err) });
    }
  }

  renderFinish() {
    const { loading, error, group } = this.state;
    if (loading) {
      return (
        <View style={{ marginTop: 100 }}>
          <Loading />
        </View>
      );
    }
    console.log('render finish ===== ', error);

    if (error !== '') {
      return (
        <View style={{ marginTop: 100, marginHorizontal: '20%' }}>
          <CustomButton onPress={() => this.setState({ loading: true }, this.createGroup)} bgColor={Colors.background.darkCyan}>
            {trans('global.try_again')}
          </CustomButton>
        </View>
      );
    }

    return (
      <Completed
        detail={group}
        type={FEEDABLE_GROUP}
      />
    );
  }

  renderProgress = (initialAmount) => {
    const { activeStep } = this.state;
    const progressAmount = (activeStep / 4) * 100;

    if (activeStep > 4) {
      return null;
    }

    let defaultAmount = initialAmount || null;

    if (activeStep === 3) {
      defaultAmount = 100;
    }

    return (
      <View style={styles.progress}>
        <ProgressBar defaultAmount={defaultAmount} amount={progressAmount} changesColor={false} />
        <Heading
          size={16}
          style={styles.stepsCount}
          fontVariation="bold"
          color={activeStep === 4 ? Colors.text.pink : Colors.text.lightGray}
        >
          <Heading size={16} fontVariation="bold" color={Colors.text.pink}>{trans('add.step', { activeStep })}</Heading> {trans('add.out_of', { value: 4 })}
          {activeStep === 4 && <Heading size={16} fontVariation="bold">, {trans('add.well_done')}</Heading>}
        </Heading>
      </View>
    );
  }

  render() {
    const { activeStep, error, strech, about, type, shareSearchInputFocused, notification } = this.state;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        {(activeStep !== 5) &&
        <ToolBar
          title={trans('add.add_a_new_group')}
          onBack={this.onBackButtonPress}
        />
        }
        {notification &&
          <AppNotification message={error} image={ErrorIcon} type="icon" handleClose={this.onCloseNotification} />
        }
        {(activeStep !== 5 && activeStep !== 4) &&
          <Container
            innerRef={(ref) => { this.container = ref; }}
            style={{ backgroundColor: 'transparent' }}
          >
            {this.renderProgress()}
            {(activeStep === 1) && <Stretch defaultValue={strech} onNext={this.onStrechNext} scrollContainer={this.container} />}
            {(activeStep === 2) && <About defaultValue={about} onNext={this.onAboutNext} />}
            {(activeStep === 3) && <OpenClosed defaultValue={type} onNext={this.onTypeNext} />}
          </Container>
        }
        {(activeStep === 4) &&
          <View style={{ flex: 1 }}>
            <View style={{ overflow: 'hidden', height: shareSearchInputFocused ? 0 : 'auto' }}>
              {this.renderProgress(80)}
            </View>
            <Share
              type={FEEDABLE_GROUP}
              onNext={this.onShareAndPublish}
              buttonText={trans('global.add_and_publish_button')}
              searchInputFocused={shareSearchInputFocused}
              onInputStateChange={this.onShareSearchInputStateChange}
            />
          </View>
        }
        {(activeStep === 5) && this.renderFinish()}
      </Wrapper>
    );
  }
}

Group.propTypes = {
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(submitGroup, connect(mapStateToProps))(Group);
