import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image, Clipboard } from 'react-native';
import Tab from '@components/tab';
import PropTypes from 'prop-types';
import Comment from '@components/ask/comment';
import Trip from '@components/offer/trip';
import Date from '@components/ask/date';
import Photo from '@components/ask/photo';
import Share from '@components/common/share';
import Completed from '@components/common/completed';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { Loading, Wrapper, Container } from '@components/common';

import { submitAsk } from '@services/apollo/ask';

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
      comment: {},
      photo: {},
      trip: {},
      dates: [],
      share: {},
      activeTab: 1,
      disabledTabs: [2, 3, 4, 5],
      completedTabs: [],
      loading: false,
      ask: {},
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    if (params && typeof params.isReturnedTrip !== 'undefined') {
      this.setState({
        isReturnedTrip: true,
        defaultTrip: { start: params.defaultTrip.start, end: params.defaultTrip.end },
      });
    }
  }

  onCommentNext = (comment) => {
    if (comment.text === '') {
      Alert.alert('Error!!', 'Comment is required');
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(1);
      delete disabledTabs[disabledTabs.indexOf(1)];
      this.setState({ comment, completedTabs, disabledTabs, activeTab: 2 });
    }
  }

  onPhotoNext = (photo) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(2);
    delete disabledTabs[disabledTabs.indexOf(2)];
    this.setState({ photo, completedTabs, disabledTabs, activeTab: 3 });
  }

  onTripNext = (trip) => {
    let error = 0;

    if (typeof trip.start.name === 'undefined') {
      Alert.alert('Error!!', 'From is required.');
      error += 1;
    } else if (typeof trip.end.name === 'undefined') {
      Alert.alert('Error!!', 'Destination is required');
      error += 1;
    }

    if (error === 0) {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(3);
      delete disabledTabs[disabledTabs.indexOf(3)];
      this.setState({ trip, completedTabs, disabledTabs, activeTab: 4 });
    }
  }

  onDateNext = (date) => {
    if (date.dates.length < 1) {
      Alert.alert('Error!!', 'Date is required');
    } else if (date.time === '00:00') {
      Alert.alert('Error!!', 'Time is required');
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(4);
      delete disabledTabs[disabledTabs.indexOf(4)];
      this.setState({ date, completedTabs, disabledTabs, activeTab: 5 });
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
        defaultTrip: { end: this.state.trip.start, start: this.state.trip.end },
      });
    } else {
      navigate('Feed', { refetch: true });
    }
  }

  createTrip() {
    const { comment, photo, trip, date, share } = this.state;
    const rideData = {
      comment: comment.text,
      photo: photo.photo,
      tripStart: trip.start,
      tripEnd: trip.end,
      returnTrip: trip.isReturning,
      dates: date.dates,
      time: date.time,
      flexibility: date.flexsible,
      share,
    };

    try {
      this.props.submit(rideData).then((res) => {
        if (share.social.indexOf('copy_to_clip') > -1) {
          Clipboard.setString(res.data.createTrip.url);
        }

        this.setState({ loading: false, ask: res.data.createTrip });
      });
    } catch (error) {
      console.error(error);
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
            Return ride of your offered ride to Stockholm on December 20th
          </Text>
        </View>
      );
    }

    return (<Text style={styles.mainTitle}>Ask for a ride</Text>);
  }

  renderFinish() {
    const { loading, ask, share } = this.state;
    if (loading) {
      return (<Loading />);
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
    const { activeTab, completedTabs, disabledTabs, isReturnedTrip, defaultTrip } = this.state;
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
              label="Comment"
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
          {(activeTab === 1) && <Comment onNext={this.onCommentNext} />}
          {(activeTab === 2) && <Photo onNext={this.onPhotoNext} />}
          {(activeTab === 3) && <Trip
            isReturnTrip={isReturnedTrip}
            start={defaultTrip.start}
            end={defaultTrip.end}
            onNext={this.onTripNext}
          />}
          {(activeTab === 4) && <Date onNext={this.onDateNext} />}
          {(activeTab === 5) && <Share onNext={this.onShareAndPublishNext} />}
          {(activeTab === 6) && this.renderFinish()}
        </Container>
      </Wrapper>
    );
  }
}

Ask.propTypes = {
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(submitAsk, connect(mapStateToProps))(Ask);
