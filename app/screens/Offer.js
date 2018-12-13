import React, { Component } from 'react';
import { StyleSheet, View, Clipboard, Keyboard, BackHandler, Alert, Platform, PermissionsAndroid } from 'react-native';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Description from '@components/offer/description';
import Route from '@components/offer/route';
import Date from '@components/offer/date';
import Seats from '@components/offer/seats';
import Share from '@components/common/share';
import Completed from '@components/common/completed';
import { Loading, Wrapper, ProgressBar, Container } from '@components/common';
import { withCreateTrip } from '@services/apollo/trip';
import CustomButton from '@components/common/customButton';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { Colors } from '@theme';
import { getTimezone } from '@helpers/device';
import Moment from 'moment-timezone';
import { FEED_TYPE_OFFER, FEEDABLE_TRIP, STRETCH_TYPE_ROUTE } from '@config/constant';
import { isToday, isFuture } from '@components/date';
import _reverse from 'lodash/reverse';
import ToolBar from '@components/utils/toolbar';
import { submitSuggestion } from '@services/apollo/suggest';
import { getDate, APP_URL } from '@config';
import { trans } from '@lang/i18n';
import { Heading } from '@components/utils/texts';
import SendSMS from 'react-native-sms';
import FBShare from '@services/facebook/share';

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    margin: 12,
    textAlign: 'center',
  },
  progress: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  stepsCount: {
    fontSize: 16,
    marginTop: 10,
  },
  returnHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  returnIcon: {
    width: 50,
    height: 36,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 6,
  },
  returnText: {
    width: 210,
    alignSelf: 'center',
    textAlign: 'center',
    lineHeight: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  footer: {
    marginTop: 'auto',
    backgroundColor: Colors.background.mutedBlue,
    elevation: 15,
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
  },
});

class Offer extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isReturnedTrip: false,
      parentId: null,
      description: {
        text: '',
        photo: null,
      },
      route: {
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
        stops: [
          {
            name: '',
            countryCode: '',
            coordinates: [],
          },
        ],
        isReturning: true,
        direction: null,
      },
      date: {
        days: [],
        time: '00:00',
        flexibilityInfo: {
          duration: 0,
          unit: 'minutes',
          type: 'later',
        },
      },
      seat: '3',
      share: {},
      shareSearchInputFocused: false,
      activeStep: 1,
      loading: false,
      trip: {},
      error: '',
      isSuggestion: false,
      groupId: null,
      suggestion: {},
      group: {},
      tripId: null,
      offset: null,
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;

    if (params && typeof params.isReturnedTrip !== 'undefined') {
      const { parentId, trip, share, defaultGroup, defaultTripId, defaultSuggestion } = params;
      const { description, route, date, seat } = trip;

      this.setState({
        isReturnedTrip: true,
        returnText: `${route.end.name} on ${date.days.join(', ')}`,
        parentId,
        description,
        route: {
          direction: route.direction,
          directionFrom: route.directionTo,
          directionTo: route.directionFrom,
          start: route.end,
          end: route.start,
          stops: _reverse(route.stops),
          isReturning: route.isReturning,
        },
        date: {
          days: [],
          time: date.time,
          flexibilityInfo: date.flexibilityInfo,
        },
        seat,
        share: {
          ...share,
          groupId: defaultGroup.id,
          offeredUser: (defaultSuggestion.User && defaultSuggestion.User) || {},
        },
        groupId: defaultGroup.id,
        tripId: defaultTripId,
        isSuggestion: (!!defaultTripId),
        suggestion: defaultSuggestion,
        group: defaultGroup,
      });
    }

    if (params && typeof params.isSuggestion !== 'undefined') {
      const { trip, description } = params;

      this.setState({
        isSuggestion: true,
        suggestion: trip,
        description: { text: description, photo: null },
        date: {
          days: [getDate(trip.date).format('YYYY-MM-DD').toString()],
          time: getDate(trip.date).format('HH:mm').toString(),
          flexibilityInfo: {
            duration: trip.flexibilityInfo ? trip.flexibilityInfo.duration : 0,
            unit: trip.flexibilityInfo ? trip.flexibilityInfo.unit : 'minutes',
            type: trip.flexibilityInfo ? trip.flexibilityInfo.type : 'later',
          },
          isFlexible: (trip.flexibilityInfo && trip.flexibilityInfo.duration !== 0) || false,
        },
        route: {
          directionFrom: trip.TripStart.name ? null : trip.direction,
          directionTo: trip.TripEnd.name ? null : trip.direction,
          start: {
            name: trip.TripStart.name ? trip.TripStart.name : '',
            coordinates: trip.TripStart.name ? trip.TripStart.coordinates : [],
            countryCode: trip.TripStart.name ? trip.TripStart.countryCode : '',
          },
          end: {
            name: trip.TripEnd.name ? trip.TripEnd.name : '',
            coordinates: trip.TripEnd.name ? trip.TripEnd.coordinates : [],
            countryCode: trip.TripEnd.name ? trip.TripEnd.countryCode : '',
          },
          stops: [],
          isReturning: true,
        },
        share: { offeredUser: trip.User },
        tripId: trip.id,
      });
    }

    if (params && params.group) {
      const { group, description } = params;
      this.setState({
        share: { groups: [group.id], groupId: group.id },
        groupId: group.id,
        group,
        description: { text: description, photo: null },
      });

      if (params.group.outreach === STRETCH_TYPE_ROUTE) {
        this.setState({
          route: {
            start: {
              name: group.TripStart.name ? group.TripStart.name : '',
              coordinates: group.TripStart.name ? group.TripStart.coordinates : [],
              countryCode: group.TripStart.name ? group.TripStart.countryCode : '',
            },
            end: {
              name: group.TripEnd.name ? group.TripEnd.name : '',
              coordinates: group.TripEnd.name ? group.TripEnd.coordinates : [],
              countryCode: group.TripEnd.name ? group.TripEnd.countryCode : '',
            },
            stops: group.Stops.length < 0 ? [] :
              group.Stops.map(stop => ({
                name: stop.name,
                coordinates: stop.coordinates,
                countryCode: group.TripEnd.countryCode,
              })),
            isReturning: true,
            directionFrom: group.TripStart.name ? null : group.direction,
            directionTo: group.TripEnd.name ? null : group.direction,
          },
        });
      }
    }

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
        trans('add.are_you_sure_you_want_to_exit'),
        [
          { text: trans('global.cancel'), onPress: () => { }, style: 'cancel' },
          { text: trans('global.ok'), onPress: () => navigation.goBack() },
        ],
        { cancelable: true },
      );
      return true;
    }

    if (activeStep === 6) {
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
  };

  onDescriptionNext = (description) => {
    if (description.text === '') {
      this.setState({ error: getToast(['DESCRIPTION_REQUIRED']) }, this.scrollToTop);
    } else {
      this.setState({ description, activeStep: 2, error: '' }, this.scrollToTop);
    }
  };

  onRouteNext = (route) => {
    if (route.start.coordinates.length === 0 && route.end.coordinates.length === 0) {
      this.setState({ error: getToast(['EITHER_FROM_TO_REQUIRED']) }, this.scrollToTop);
    } else {
      let direction = '';
      if (route.start.coordinates.length === 0 || route.end.coordinates.length === 0) {
        direction = 'anywhere';
      }

      if (route.directionFrom) direction = route.directionFrom;
      if (route.directionTo) direction = route.directionTo;

      this.setState({
        route: { ...route, direction },
        activeStep: 3,
        error: '',
      }, this.scrollToTop);
    }
  };

  onDateNext = (date) => {
    if (date.days.length < 1) {
      this.setState({ error: getToast(['DATE_REQUIRED']) });
    } else if (date.time === '00:00') {
      this.setState({ error: getToast(['TIME_REQUIRED']) });
    } else if (!this.isValidDateTime(date)) {
      this.setState({ error: getToast(['INVALID_TIME']) });
    } else {
      this.setState({ date, activeStep: 4, error: '' });
    }
  }

  onSeatNext = (seat) => {
    if (seat === '' || parseInt(seat, 10) < 1 || isNaN(parseInt(seat, 10))) {
      this.setState({ error: getToast(['SEAT_REQUIRED']) }, this.scrollToTop);
    } else {
      this.setState({ seat, activeStep: 5, error: '' });
    }
  };

  onShareNext = (share) => {
    this.setState({
      share,
      activeStep: 6,
      loading: true,
    }, this.createTrip,
    );
  };

  onShareSearchInputStateChange = focused => this.setState({ shareSearchInputFocused: focused })

  onMakeReturnRide = () => {
    const { navigation } = this.props;
    const { description, route, date, seat, trip, share, group, tripId, suggestion } = this.state;
    navigation.replace('Offer', {
      isReturnedTrip: true,
      parentId: trip.id,
      trip: { description, route, date, seat },
      share,
      defaultGroup: group,
      defaultTripId: tripId,
      defaultSuggestion: suggestion,
    });
  }

  isValidDateTime = (date) => {
    if (
      date.days.length === 1
      && isToday(date.days[0])
      && !isFuture(`${date.days[0]} ${date.time}`)
    ) {
      return false;
    }

    return true;
  }

  scrollToTop = () => {
    const { activeStep } = this.state;
    Keyboard.dismiss();
    if (activeStep !== 5) {
      setTimeout(() => {
        this.container.scrollTo({ x: 0, y: 0, animated: true });
      }, 0);
    }
  }

  createTrip() {
    const { description, route, date, seat, share, parentId, groupId, tripId } = this.state;
    let utcTime = '';
    const dates = [];

    date.days.forEach((tripDate) => {
      const dateTime = this.convertToGMT(tripDate, date.time).split(' ');
      utcTime = dateTime[1];
      dates.push(dateTime[0]);
    });

    const tripData = {
      parentId,
      description: description.text,
      photo: description.photo,
      tripStart: route.start,
      tripEnd: route.end,
      stops: route.stops,
      returnTrip: route.isReturning,
      dates,
      time: utcTime,
      flexibilityInfo: date.flexibilityInfo,
      seats: seat,
      share: { social: share.social, friends: share.friends, groups: share.groups },
      type: FEED_TYPE_OFFER,
      groupId,
      linkedTripId: tripId,
      direction: route.direction ? route.direction.toLowerCase() : null,
    };

    try {
      this.props.createTrip(tripData).then(async (res) => {
        if (share.clipboard.indexOf('copy_to_clip') > -1) {
          Clipboard.setString(res.data.createTrip.url);
        }

        if (share.contacts && share.contacts.length > 0) {
          const { contacts } = share;
          const { TripStart, TripEnd, direction, id } = res.data.createTrip;
          const smsBody = trans('share.share_trip',
            { tripStart: TripStart.name || direction, tripEnd: TripEnd.name || direction, url: `${APP_URL}/t/${id}` },
          );

          if (Platform.OS === 'android') {
            const permission = await PermissionsAndroid
              .check(PermissionsAndroid.PERMISSIONS.READ_SMS);

            if (!permission) {
              const status = await PermissionsAndroid
                .request(PermissionsAndroid.PERMISSIONS.READ_SMS);

              if (status === 'granted') {
                this.sendSMS(smsBody, contacts);
              } else {
                Alert.alert(trans('share.allow_sms_permission'));
              }
            } else {
              this.sendSMS(smsBody, contacts);
            }
          } else {
            this.sendSMS(smsBody, contacts);
          }
        }

        if (share.social && share.social.includes('Facebook')) {
          FBShare.link(FEED_TYPE_OFFER, res.data.createTrip);
        }

        this.setState({ loading: false, trip: res.data.createTrip });
        this.createSuggestion();
      });
    } catch (error) {
      console.warn(error);
    }
  }

  sendSMS = (smsBody, contacts) => {
    SendSMS.send({
      body: smsBody,
      recipients: contacts,
      successTypes: ['sent', 'queued'],
    }, () => { });
  }

  createSuggestion() {
    const { createSuggestion } = this.props;
    const { isSuggestion, suggestion } = this.state;
    const offeredTrip = this.state.trip;

    if (Object.keys(suggestion).length > 0 && isSuggestion) {
      createSuggestion({
        type: 'trip',
        tripId: suggestion.id,
        suggestedTripId: offeredTrip.id,
        isOffer: true,
      }).catch(error => console.warn(error));
    }

    return null;
  }

  convertToGMT = (date, time) => Moment(`${date} ${time}`).tz(getTimezone()).utc().format('YYYY-MM-DD HH:mm');

  renderFinish() {
    const { loading, trip, error, route, isReturnedTrip, suggestion, group, date } = this.state;

    if (loading) {
      return (
        <View style={{ marginTop: 100 }}>
          <Loading />
        </View>
      );
    }

    if (error !== '') {
      return (
        <View style={{ marginTop: 100 }}>
          <CustomButton onPress={this.createTrip} bgColor={Colors.background.darkCyan}>
            {trans('global.try_again')}
          </CustomButton>
        </View>
      );
    }

    return (
      <Completed
        detail={trip}
        type={FEEDABLE_TRIP}
        isReturnedTrip={isReturnedTrip ? false : route.isReturning}
        onMakeReturnRide={this.onMakeReturnRide}
        suggestion={suggestion}
        group={group}
        isRecurring={date.days && date.days.length > 1}
      />
    );
  }

  renderProgress = (initialAmount) => {
    const { activeStep } = this.state;
    const progressAmount = (activeStep / 5) * 100;
    if (activeStep > 5) {
      return null;
    }

    let defaultAmount = initialAmount || null;

    if (activeStep === 4) {
      defaultAmount = 100;
    }

    return (
      <View style={styles.progress}>
        <ProgressBar defaultAmount={defaultAmount} amount={progressAmount} changesColor={false} />
        <Heading
          size={16}
          style={styles.stepsCount}
          fontVariation="bold"
          color={activeStep === 5 ? Colors.text.pink : Colors.text.lightGray}
        >
          <Heading size={16} fontVariation="bold" color={Colors.text.pink}>{trans('add.step', { activeStep })}</Heading> {trans('add.out_of', { value: 5 })}
          {activeStep === 5 && <Heading size={16} fontVariation="bold">, {trans('add.well_done')}</Heading>}
        </Heading>
      </View>
    );
  }

  render() {
    const {
      activeStep,
      isReturnedTrip,
      description,
      route,
      date,
      seat,
      error,
      share,
      shareSearchInputFocused,
    } = this.state;

    return (
      <Wrapper>
        {activeStep !== 6 &&
          <ToolBar
            title={!isReturnedTrip ? trans('add.offer_a_ride') : trans('add.add_a_return_ride')}
            onBack={this.onBackButtonPress}
          />
        }
        <Toast message={error} type="error" />
        {
          (activeStep !== 6 && activeStep !== 5) &&
          <Container
            innerRef={(ref) => { this.container = ref; }}
            style={{ backgroundColor: 'transparent' }}
          >
            {this.renderProgress()}
            {
              (activeStep === 1) &&
              <Description isOffer defaultValue={description} onNext={this.onDescriptionNext} />
            }
            {
              (activeStep === 2) &&
              <Route
                defaultValue={route}
                hideReturnTripOption={isReturnedTrip}
                onNext={this.onRouteNext}
                isOffer
                scrollContainer={this.container}
              />
            }
            {(activeStep === 3) && <Date isOffer defaultValue={date} onNext={this.onDateNext} />}
            {(activeStep === 4) && <Seats isOffer defaultValue={seat} onNext={this.onSeatNext} />}
          </Container>
        }
        {(activeStep === 5) &&
          <View style={{ flex: 1 }}>
            <View style={{ overflow: 'hidden', height: shareSearchInputFocused ? 0 : 'auto' }}>
              {this.renderProgress(80)}
            </View>
            <Share
              defaultValue={share}
              type={FEEDABLE_TRIP}
              onNext={this.onShareNext}
              searchInputFocused={shareSearchInputFocused}
              onInputStateChange={this.onShareSearchInputStateChange}
            />
          </View>
        }
        {(activeStep === 6) && this.renderFinish()}
      </Wrapper>
    );
  }
}

Offer.propTypes = {
  createTrip: PropTypes.func.isRequired,
  createSuggestion: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default compose(withCreateTrip, submitSuggestion)(Offer);
