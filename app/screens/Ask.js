import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Clipboard } from 'react-native';
import Tab from '@components/tab';
import PropTypes from 'prop-types';
import Description from '@components/ask/description';
import Trip from '@components/offer/trip';
import Date from '@components/ask/date';
import Photo from '@components/ask/photo';
import Share from '@components/common/share';
import Completed from '@components/common/completed';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { Loading, Wrapper, Container } from '@components/common';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import CustomButton from '@components/common/customButton';
import { withCreateTrip } from '@services/apollo/trip';
import Colors from '@theme/colors';
import { getTimezone } from '@helpers/device';
import Moment from 'moment-timezone';
import { FEED_TYPE_WANTED } from '@config/constant';

const styles = StyleSheet.create({
  backButtonWrapper: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  returnHeader: {
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backIcon: {
    height: 13,
    resizeMode: 'contain',
    marginRight: 6,
  },
  backText: {
    color: '#999',
    fontSize: 13,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    margin: 12,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
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
        description: { text: '' },
        photo: { photo: null },
        flexibilityInfo: {
          duration: 0,
          unit: 'minute',
          type: 'later',
        },
      },
      description: {},
      photo: {},
      trip: {},
      dates: [],
      share: {},
      activeTab: 1,
      disabledTabs: [2, 3, 4, 5],
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
          photo: params.defaultTrip.photo,
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
      this.setState({ description, completedTabs, disabledTabs, activeTab: 2, error: '' });
    }
  }

  onPhotoNext = (photo) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(2);
    delete disabledTabs[disabledTabs.indexOf(2)];
    this.setState({ photo, completedTabs, disabledTabs, activeTab: 3, error: '' });
  }

  onTripNext = (trip) => {
    if (trip.start.coordinates.length === 0) {
      this.setState({ error: getToast(['FROM_REQUIRED']) });
    } else if (trip.end.coordinates.length === 0) {
      this.setState({ error: getToast(['TO_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(3);
      delete disabledTabs[disabledTabs.indexOf(3)];
      this.setState({ trip, completedTabs, disabledTabs, activeTab: 4, error: '' });
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
      delete disabledTabs[disabledTabs.indexOf(4)];
      this.setState({ date, completedTabs, disabledTabs, activeTab: 5, error: '' });
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
        activeTab: 6,
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
          photo: this.state.photo,
          time: this.state.date.time,
          flexibilityInfo: this.state.date.flexibilityInfo,
        },
      });
    } else {
      navigate('Feed', { refetch: true });
    }
  }

  createTrip() {
    const { description, photo, trip, date, share, parentId } = this.state;
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
      photo: photo.photo,
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
          <Image source={require('@icons/icon_return.png')} style={styles.returnIcon} />
          <Text style={styles.mainTitle}>Return ride</Text>
          <Text style={styles.returnText}>
            Return ride of your asked ride to {this.state.defaultTrip.end.name} on {this.state.defaultTrip.dates.join(', ')}
          </Text>
        </View>
      );
    }

    return (<Text style={styles.mainTitle}>Ask for a ride</Text>);
  }

  renderFinish() {
    const { loading, ask, share, error } = this.state;

    if (loading) {
      return (<Loading />);
    }

    if (error !== '') {
      return (<View>
        <Toast message={error} type="error" />
        <CustomButton onPress={this.createTrip} bgColor={Colors.background.darkCyan}>
          Try Again
        </CustomButton>
      </View>);
    }

    return (<Completed
      url={ask.url}
      text="ride"
      isCliped={share.social.indexOf('copy_to_clip') > -1}
      onButtonPress={this.onButtonPress}
      isReturnedTrip={this.state.trip.isReturning}
      onMakeReturnRide={this.onMakeReturnRide}
    />);
  }

  render() {
    const {
      activeTab,
      completedTabs,
      disabledTabs,
      isReturnedTrip,
      defaultTrip,
      error,
    } = this.state;
    const { navigation } = this.props;

    return (
      <Wrapper bgColor="#eded18" >
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('@icons/icon_back.png')} style={styles.backIcon} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Container bgColor="#f3f3ed">
          {this.header()}
          <View style={styles.tabContainer}>
            <Tab
              label="Description"
              disabled={disabledTabs.indexOf(1) > -1}
              complete={completedTabs.indexOf(1) > -1}
              active={activeTab === 1}
            />
            <Tab
              label="Photo"
              disabled={disabledTabs.indexOf(2) > -1}
              complete={completedTabs.indexOf(2) > -1}
              active={activeTab === 2}
            />
            <Tab
              label="Trip"
              disabled={disabledTabs.indexOf(3) > -1}
              complete={completedTabs.indexOf(3) > -1}
              active={activeTab === 3}
            />
            <Tab
              label="Date"
              disabled={disabledTabs.indexOf(4) > -1}
              complete={completedTabs.indexOf(4) > -1}
              active={activeTab === 4}
            />
            <Tab
              label="Share"
              disabled={disabledTabs.indexOf(5) > -1}
              complete={completedTabs.indexOf(5) > -1}
              active={activeTab === 5}
            />
          </View>
          <Toast message={error} type="error" />
          {(activeTab === 1) && <Description
            onNext={this.onDescriptionNext}
            defaultDescription={defaultTrip.description}
          />}
          {(activeTab === 2) && <Photo
            onNext={this.onPhotoNext}
            defaultPhoto={defaultTrip.photo.photo}
          />}
          {(activeTab === 3) && <Trip
            isReturnTrip={isReturnedTrip}
            start={defaultTrip.start}
            end={defaultTrip.end}
            onNext={this.onTripNext}
          />}
          {(activeTab === 4) && <Date
            onNext={this.onDateNext}
            defaultTime={defaultTrip.time}
            defaultFlexibilityInfo={defaultTrip.flexibilityInfo}
          />}
          {(activeTab === 5) && <Share onNext={this.onShareAndPublishNext} />}
          {(activeTab === 6) && this.renderFinish()}
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
