import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Tab from '@components/tab';
import Description from '@components/offer/description';
import Trip from '@components/offer/trip';
import Date from '@components/offer/date';
import Seats from '@components/offer/seats';
import Share from '@components/common/share';
import Completed from '@components/common/completed';
import { Loading, Wrapper, Container } from '@components/common';
import { submitOffer } from '@services/apollo/offer';
import CustomButton from '@components/common/customButton';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    margin: 12,
    textAlign: 'center',
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

class Offer extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isReturnedTrip: false,
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
      },
      description: {},
      trip: {},
      dates: [],
      seat: 1,
      share: {},
      activeTab: 1,
      disabledTabs: [2, 3, 4, 5],
      completedTabs: [],
      loading: false,
      offer: {},
      error: '',
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params && typeof params.isReturnedTrip !== 'undefined') {
      this.setState({
        isReturnedTrip: true,
        defaultTrip: {
          start: params.defaultTrip.start,
          end: params.defaultTrip.end,
          dates: params.defaultTrip.dates,
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
  };

  onTripNext = (trip) => {
    if (trip.start.coordinates.length === 0) {
      this.setState({ error: getToast(['FROM_REQUIRED']) });
    } else if (trip.end.coordinates.length === 0) {
      this.setState({ error: getToast(['TO_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(2);
      delete disabledTabs[disabledTabs.indexOf(2)];
      this.setState({ trip, completedTabs, disabledTabs, activeTab: 3, error: '' });
    }
  };

  onDateNext = (date) => {
    if (date.dates.length < 1) {
      this.setState({ error: getToast(['DATE_REQUIRED']) });
    } else if (date.time === '00:00') {
      this.setState({ error: getToast(['TIME_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(3);
      delete disabledTabs[disabledTabs.indexOf(3)];
      this.setState({ date, completedTabs, disabledTabs, activeTab: 4, error: '' });
    }
  }

  onSeatNext = (seat) => {
    if (seat === '' || parseInt(seat, 10) < 1) {
      this.setState({ error: getToast(['SEAT_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(4);
      delete disabledTabs[disabledTabs.indexOf(4)];
      this.setState({ seat, completedTabs, disabledTabs, activeTab: 5, error: '' });
    }
  };

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
      navigate('Offer', {
        isReturnedTrip: true,
        defaultTrip: {
          end: this.state.trip.start,
          start: this.state.trip.end,
          dates: this.state.date.dates,
        },
      });
    } else {
      navigate('Feed', { refetch: true });
    }
  }

  createTrip() {
    const { description, trip, date, seat, share } = this.state;

    const rideData = {
      description: description.text,
      tripStart: trip.start,
      tripEnd: trip.end,
      photo: description.photo,
      stops: trip.stops,
      returnTrip: trip.isReturning,
      dates: date.dates,
      time: date.time,
      seats: seat,
      flexibility: date.flexsible,
      share,
    };

    try {
      this.props.submit(rideData).then((res) => {
        if (share.social.indexOf('copy_to_clip') > -1) {
          Clipboard.setString(res.data.createTrip.url);
        }

        this.setState({ loading: false, offer: res.data.createTrip });
      });
    } catch (error) {
      console.warn(error);
    }
  }

  header() {
    const { isReturnedTrip } = this.state;
    if (isReturnedTrip) {
      return (
        <View style={styles.returnHeader}>
          <Image source={require('@icons/icon_return.png')} style={styles.returnIcon} />
          <Text style={styles.mainTitle}>Return ride</Text>
          <Text style={styles.returnText}>
            Return ride of your offered ride to {this.state.defaultTrip.end.name} on {this.state.defaultTrip.dates.join(', ')}
          </Text>
        </View>
      );
    }

    return (<Text style={styles.mainTitle}>Offer a ride</Text>);
  }

  renderFinish() {
    const { loading, offer, share, error } = this.state;

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
      url={offer.url}
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
      <Wrapper bgColor="#eded18">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.title}>Back</Text>
        </TouchableOpacity>
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
              label="Trip"
              disabled={disabledTabs.indexOf(2) > -1}
              complete={completedTabs.indexOf(2) > -1}
              active={activeTab === 2}
            />
            <Tab
              label="Date"
              disabled={disabledTabs.indexOf(3) > -1}
              complete={completedTabs.indexOf(3) > -1}
              active={activeTab === 3}
            />
            <Tab
              label="Seats"
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

          <View>
            <Toast message={error} type="error" />
            {(activeTab === 1) && <Description onNext={this.onDescriptionNext} />}
            {(activeTab === 2) && <Trip
              isReturnTrip={isReturnedTrip}
              start={defaultTrip.start}
              end={defaultTrip.end}
              onNext={this.onTripNext}
              isOffer
            />}
            {(activeTab === 3) && <Date onNext={this.onDateNext} />}
            {(activeTab === 4) && <Seats onNext={this.onSeatNext} />}
            {(activeTab === 5) && <Share onNext={this.onShareAndPublishNext} />}
            {(activeTab === 6) && this.renderFinish()}
          </View>
        </Container>
      </Wrapper>
    );
  }
}

Offer.propTypes = {
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(submitOffer, connect(mapStateToProps))(Offer);
