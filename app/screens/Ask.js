import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import Description from '@components/ask/description';
import Trip from '@components/offer/trip';
import Date from '@components/ask/date';
import Share from '@components/common/share';
import Completed from '@components/common/completed';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { Loading, Wrapper, Container, FloatingNavbar, ProgressBar } from '@components/common';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import CustomButton from '@components/common/customButton';
import { withCreateTrip } from '@services/apollo/trip';
import Colors from '@theme/colors';
import { getTimezone } from '@helpers/device';
import Moment from 'moment-timezone';
import { FEED_TYPE_WANTED, FEEDABLE_TRIP } from '@config/constant';
import { GlobalStyles } from '@theme/styles';

const styles = StyleSheet.create({
  progress: {
    paddingHorizontal: 20,
  },
  stepsCount: {
    marginTop: 10,
  },
  returnHeader: {
    marginTop: 70,
    paddingHorizontal: 24,
    paddingVertical: 10,
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
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    margin: 12,
    textAlign: 'center',
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
      defaultTrip: {
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
        dates: [],
        time: '00:00',
        description: {
          text: '',
          photo: null,
        },
        flexibilityInfo: {
          duration: 0,
          unit: 'minute',
          type: 'later',
        },
      },
      description: {},
      trip: {},
      dates: [],
      share: {},
      activeStep: 1,
      disabledTabs: [2, 3, 4],
      completedTabs: [],
      loading: false,
      ask: {},
      error: '',
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params && typeof params.isReturnedTrip !== 'undefined') {
      this.setState({
        isReturnedTrip: true,
        parentId: params.parentId,
        defaultTrip: {
          start: params.defaultTrip.start,
          end: params.defaultTrip.end,
          dates: params.defaultTrip.dates,
          description: params.defaultTrip.description,
          time: params.defaultTrip.time,
          flexibilityInfo: params.defaultTrip.flexibilityInfo,
        },
      });
    }
  }

  onDescriptionNext = (description) => {
    if (description.text === '') {
      this.setState({ error: getToast(['DESCRIPTION_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(1);
      delete disabledTabs[disabledTabs.indexOf(1)];
      this.setState({ description, completedTabs, disabledTabs, activeStep: 2, error: '' });
    }
  }

  onTripNext = (trip) => {
    if (trip.start.coordinates.length === 0) {
      this.setState({ error: getToast(['FROM_REQUIRED']) });
    } else if (trip.end.coordinates.length === 0) {
      this.setState({ error: getToast(['TO_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(3);
      delete disabledTabs[disabledTabs.indexOf(2)];
      this.setState({ trip, completedTabs, disabledTabs, activeStep: 3, error: '' });
    }
  }

  onDateNext = (date) => {
    if (date.dates.length < 1) {
      this.setState({ error: getToast(['DATE_REQUIRED']) });
    } else if (date.time === '00:00') {
      this.setState({ error: getToast(['TIME_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(4);
      delete disabledTabs[disabledTabs.indexOf(3)];
      this.setState({ date, completedTabs, disabledTabs, activeStep: 4, error: '' });
    }
  }

  onShareAndPublishNext = (share) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(5);
    delete disabledTabs[disabledTabs.indexOf(5)];
    this.setState(
      {
        share,
        completedTabs,
        disabledTabs,
        activeStep: 5,
        loading: true,
      },
      this.createTrip,
    );
  };

  onButtonPress = () => {
    const { navigate } = this.props.navigation;
    navigate('Feed', { refetch: true });
  };

  onMakeReturnRide = () => {
    const { navigate } = this.props.navigation;
    if (this.state.trip.isReturning) {
      navigate('Ask', {
        isReturnedTrip: true,
        parentId: this.state.ask.id,
        defaultTrip: {
          end: this.state.trip.start,
          start: this.state.trip.end,
          dates: this.state.date.dates,
          description: this.state.description,
          time: this.state.date.time,
          flexibilityInfo: this.state.date.flexibilityInfo,
        },
      });
    } else {
      navigate('Feed', { refetch: true });
    }
  }

  createTrip() {
    const { description, trip, date, share, parentId } = this.state;
    let utcTime = '';
    const dates = [];

    date.dates.forEach((tripDate) => {
      const dateTime = this.convertToGMT(tripDate, date.time).split(' ');
      utcTime = dateTime[1];
      dates.push(dateTime[0]);
    });

    const rideData = {
      parentId,
      description: description.text,
      photo: description.photo,
      tripStart: trip.start,
      tripEnd: trip.end,
      returnTrip: trip.isReturning || trip.isReturnTrip,
      dates,
      time: utcTime,
      flexibilityInfo: date.flexibilityInfo,
      share,
      stops: null,
      seats: 0,
      type: FEED_TYPE_WANTED,
    };

    try {
      this.props.createTrip(rideData).then((res) => {
        if (share.social.indexOf('copy_to_clip') > -1) {
          Clipboard.setString(res.data.createTrip.url);
        }

        this.setState({ loading: false, ask: res.data.createTrip });
      });
    } catch (error) {
      console.warn(error);
    }
  }

  convertToGMT = (date, time) => Moment(`${date} ${time}`).tz(getTimezone()).utc().format('YYYY-MM-DD HH:mm');

  header() {
    const { isReturnedTrip } = this.state;
    if (isReturnedTrip) {
      return (
        <View style={styles.returnHeader}>
          <Image source={require('@assets/icons/icon_return.png')} style={styles.returnIcon} />
          <Text style={styles.mainTitle}>Return ride</Text>
          <Text style={styles.returnText}>
            Return ride of your asked ride to {this.state.defaultTrip.end.name} on {this.state.defaultTrip.dates.join(', ')}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderFinish() {
    const { loading, ask, error, trip } = this.state;

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
        detail={ask}
        type={FEEDABLE_TRIP}
        isReturnedTrip={trip.isReturning}
        onMakeReturnRide={this.onMakeReturnRide}
      />
    );
  }

  render() {
    const {
      activeStep,
      isReturnedTrip,
      defaultTrip,
      error,
    } = this.state;
    const { navigation } = this.props;
    const progressAmount = (activeStep / 6) * 100;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <FloatingNavbar
          handleBack={() => navigation.goBack()}
          title="Ask for a ride"
          transparent={false}
        />
        <Container bgColor="transparent">
          {this.header()}
          {
            this.state.activeStep <= 4 &&
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
          }
          <Toast message={error} type="error" />
          {(activeStep === 1) && <Description
            onNext={this.onDescriptionNext}
            defaultDescription={defaultTrip.description}
          />}
          {(activeStep === 2) && <Trip
            isReturnTrip={isReturnedTrip}
            start={defaultTrip.start}
            end={defaultTrip.end}
            onNext={this.onTripNext}
          />}
          {(activeStep === 3) && <Date
            onNext={this.onDateNext}
            defaultTime={defaultTrip.time}
            defaultFlexibilityInfo={defaultTrip.flexibilityInfo}
          />}
          {(activeStep === 4) && <Share
            onNext={this.onShareAndPublishNext}
            labelColor={Colors.text.blue}
          />}
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
