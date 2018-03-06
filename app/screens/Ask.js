import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Clipboard, Keyboard, BackHandler, Alert } from 'react-native';
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
import { FEED_TYPE_WANTED, FEEDABLE_TRIP } from '@config/constant';
import { isToday, isFuture } from '@components/date';
import { GlobalStyles } from '@theme/styles';
import _reverse from 'lodash/reverse';
import ToolBar from '@components/utils/toolbar';

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
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;

    if (params && typeof params.isReturnedTrip !== 'undefined') {
      const { parentId, trip } = params;
      const { description, route, date } = trip;

      this.setState({
        isReturnedTrip: true,
        returnText: `${route.end.name} on ${date.days.join(', ')}`,
        parentId,
        description,
        route: {
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
      });
    }

    if (params && params.groupId) {
      this.setState({ share: { groups: [params.groupId] } });
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
    if (route.start.coordinates.length === 0) {
      this.setState({ error: getToast(['FROM_REQUIRED']) }, this.scrollToTop);
    } else if (route.end.coordinates.length === 0) {
      this.setState({ error: getToast(['TO_REQUIRED']) }, this.scrollToTop);
    } else {
      this.setState({ route, activeStep: 3, error: '' }, this.scrollToTop);
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

  onShareAndPublishNext = (share) => {
    this.setState({
      share,
      activeStep: 5,
      loading: true,
    }, this.createTrip,
    );
  };

  onMakeReturnRide = () => {
    const { navigation } = this.props;
    const { description, route, date, trip } = this.state;
    navigation.replace('Ask', {
      isReturnedTrip: true,
      parentId: trip.id,
      trip: { description, route, date },
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
    const { description, route, date, share, parentId } = this.state;
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
      share,
      type: FEED_TYPE_WANTED,
    };

    try {
      this.props.createTrip(tripData).then((res) => {
        if (share.social.indexOf('copy_to_clip') > -1) {
          Clipboard.setString(res.data.createTrip.url);
        }

        this.setState({ loading: false, trip: res.data.createTrip });
      });
    } catch (error) {
      console.warn(error);
    }
  }

  convertToGMT = (date, time) => Moment(`${date} ${time}`).tz(getTimezone()).utc().format('YYYY-MM-DD HH:mm');

  renderReturnRideText() {
    const { isReturnedTrip, returnText } = this.state;
    if (isReturnedTrip) {
      return (
        <View style={styles.returnHeader}>
          <Image source={require('@assets/icons/icon_return.png')} style={styles.returnIcon} />
          <Text style={styles.mainTitle}>Return ride</Text>
          <Text style={styles.returnText}>
            Return ride of your asked ride to {returnText}
          </Text>
        </View>
      );
    }

    return null;
  }

  renderFinish() {
    const { loading, trip, error, route, isReturnedTrip } = this.state;

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
            Try Again
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
      />
    );
  }


  renderProgress = () => {
    const { activeStep } = this.state;
    const progressAmount = (activeStep / 5) * 100;
    if (activeStep > 4) {
      return null;
    }

    return (
      <View style={styles.progress}>
        <ProgressBar amount={progressAmount} color={Colors.background.blue} />
        <Text style={[
          styles.stepsCount,
          GlobalStyles.TextStyles.bold,
          GlobalStyles.TextStyles.light,
          activeStep === 4 ? GlobalStyles.TextStyles.blue : {},
        ]}
        >
          <Text style={GlobalStyles.TextStyles.blue}>Step {activeStep}</Text> of 4
          {activeStep === 4 && <Text>, well done!</Text>}
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
        <ToolBar
          title="Ask for a ride"
          onBack={this.onBackButtonPress}
        />
        <Toast message={error} type="error" />
        <Container
          innerRef={(ref) => { this.container = ref; }}
          style={{ backgroundColor: 'transparent' }}
        >
          {this.renderReturnRideText()}
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
          {(activeStep === 4) && <Share defaultValue={share} type={FEEDABLE_TRIP} onNext={this.onShareAndPublishNext} />}
          {(activeStep === 5) && this.renderFinish()}
        </Container>
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
