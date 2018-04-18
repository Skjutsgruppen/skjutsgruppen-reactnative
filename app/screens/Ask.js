import React, { Component } from 'react';
import { StyleSheet, View, Text, Clipboard, Keyboard, BackHandler, Alert } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Description from '@components/offer/description';
import Route from '@components/offer/route';
import Date from '@components/offer/date';
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
import { FEED_TYPE_WANTED, FEEDABLE_TRIP, STRETCH_TYPE_ROUTE } from '@config/constant';
import { isToday, isFuture } from '@components/date';
import { GlobalStyles } from '@theme/styles';
import _reverse from 'lodash/reverse';
import ToolBar from '@components/utils/toolbar';
import { trans } from '@lang/i18n';

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
  },
  stepsCount: {
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
});

class Ask extends Component {
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
      share: {},
      activeStep: 1,
      loading: false,
      trip: {},
      error: '',
      groupId: null,
      group: {},
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;

    if (params && typeof params.isReturnedTrip !== 'undefined') {
      const { parentId, trip, share, defaultGroup } = params;
      const { description, route, date } = trip;

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
        share: { ...share, groupId: defaultGroup.id },
        groupId: defaultGroup.id,
        group: defaultGroup,
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
              name: group.TripStart.name,
              coordinates: group.TripStart.coordinates,
              countryCode: group.TripStart.countryCode,
            },
            end: {
              name: group.TripEnd.name,
              coordinates: group.TripEnd.coordinates,
              countryCode: group.TripEnd.countryCode,
            },
            stops: group.Stops.length < 0 ? [] :
              group.Stops.map(stop => ({
                name: stop.name,
                coordinates: group.TripEnd.coordinates,
                countryCode: group.TripEnd.countryCode,
              })),
            isReturning: true,
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
      this.setState({
        route: { ...route, direction: route.directionFrom || route.directionTo },
        activeStep: 3,
        error: '',
      }, this.scrollToTop);
    }
  };

  onDateNext = (date) => {
    if (date.days.length < 1) {
      this.setState({ error: getToast(['DATE_REQUIRED']) }, this.scrollToTop);
    } else if (date.time === '00:00') {
      this.setState({ error: getToast(['TIME_REQUIRED']) }, this.scrollToTop);
    } else if (!this.isValidDateTime(date)) {
      this.setState({ error: getToast(['INVALID_TIME']) }, this.scrollToTop);
    } else {
      this.setState({ date, activeStep: 4, error: '' }, this.scrollToTop);
    }
  }

  onShareNext = (share) => {
    this.setState({
      share,
      activeStep: 5,
      loading: true,
    }, this.createTrip,
    );
  };

  onMakeReturnRide = () => {
    const { navigation } = this.props;
    const { description, route, date, trip, share, group } = this.state;

    navigation.replace('Ask', {
      isReturnedTrip: true,
      parentId: trip.id,
      trip: { description, route, date },
      share,
      defaultGroup: group,
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
    Keyboard.dismiss();
    setTimeout(() => {
      this.container.scrollTo({ x: 0, y: 0, animated: true });
    }, 0);
  }

  createTrip() {
    const { description, route, date, share, parentId, groupId } = this.state;
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
      stops: null,
      returnTrip: route.isReturning,
      dates,
      time: utcTime,
      flexibilityInfo: date.flexibilityInfo,
      seats: 0,
      share: { social: share.social, friends: share.friends, groups: share.groups },
      type: FEED_TYPE_WANTED,
      groupId,
      direction: route.direction,
    };

    try {
      this.props.createTrip(tripData).then((res) => {
        if (share.clipboard.indexOf('copy_to_clip') > -1) {
          Clipboard.setString(res.data.createTrip.url);
        }

        this.setState({ loading: false, trip: res.data.createTrip });
      });
    } catch (error) {
      console.warn(error);
    }
  }

  convertToGMT = (date, time) => Moment(`${date} ${time}`).tz(getTimezone()).utc().format('YYYY-MM-DD HH:mm');

  renderFinish() {
    const { loading, trip, error, route, isReturnedTrip, group, date } = this.state;
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
          <Toast message={error} type="error" />
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
        group={group}
        isRecurring={date.days && date.days.length > 1}
      />
    );
  }


  renderProgress = () => {
    const { activeStep } = this.state;
    const progressAmount = (activeStep / 4) * 100;
    if (activeStep > 4) {
      return null;
    }

    return (
      <View style={styles.progress}>
        <ProgressBar amount={progressAmount} color={Colors.background.blue} changesColor={false} />
        <Text style={[
          styles.stepsCount,
          GlobalStyles.TextStyles.bold,
          GlobalStyles.TextStyles.light,
          activeStep === 4 ? GlobalStyles.TextStyles.blue : {},
        ]}
        >
          <Text style={GlobalStyles.TextStyles.blue}>{trans('add.step', { activeStep })}</Text> {trans('add.out_of', { value: 4 })}
          {activeStep === 4 && <Text>, {trans('add.well_done')}</Text>}
        </Text>
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
      error,
      share,
    } = this.state;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        {activeStep !== 5 &&
          <ToolBar
            title={!isReturnedTrip ? trans('add.ask_a_ride') : trans('add.add_a_return_ride')}
            onBack={this.onBackButtonPress}
          />
        }
        <Toast message={error} type="error" />
        {activeStep !== 5 &&
          <Container
            innerRef={(ref) => { this.container = ref; }}
            style={{ backgroundColor: 'transparent' }}
          >
            {this.renderProgress()}
            {
              (activeStep === 1) &&
              <Description defaultValue={description} onNext={this.onDescriptionNext} />
            }
            {
              (activeStep === 2) &&
              <Route
                defaultValue={route}
                hideReturnTripOption={isReturnedTrip}
                onNext={this.onRouteNext}
              />
            }
            {(activeStep === 3) && <Date defaultValue={date} onNext={this.onDateNext} />}
            {(activeStep === 4) &&
              <Share
                defaultValue={share}
                type={FEEDABLE_TRIP}
                onNext={this.onShareNext}
                labelColor={Colors.text.blue}
              />
            }

          </Container>
        }
        {(activeStep === 5) && this.renderFinish()}
      </Wrapper>
    );
  }
}

Ask.propTypes = {
  createTrip: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(withCreateTrip, connect(mapStateToProps))(Ask);
