import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';

import Tab from '@components/tab';
import Comment from '@components/offer/comment';
import Trip from '@components/offer/trip';
import Date from '@components/offer/date';
import Seats from '@components/offer/seats';
import Share from '@components/offer/share';
import Completed from '@components/offer/completed';
import { Loading, Wrapper, Container } from '@components/common';

import { submitOffer } from '@services/apollo/offer';

const styles = StyleSheet.create({
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

class Offer extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      comment: {},
      trip: {},
      dates: [],
      seat: 1,
      share: {},
      activeTab: 1,
      disabledTabs: [2, 3, 4, 5],
      completedTabs: [],
      loading: false,
      offer: {},
    };
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
  };

  onTripNext = (trip) => {
    if (typeof trip.start.name === 'undefined') {
      Alert.alert('Error!!', 'From is required');
    } else if (typeof trip.end.name === 'undefined') {
      Alert.alert('Error!!', 'To is required');
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(2);
      delete disabledTabs[disabledTabs.indexOf(2)];
      this.setState({ trip, completedTabs, disabledTabs, activeTab: 3 });
    }
  };

  onDateNext = (date) => {
    if (date.dates.length < 1) {
      Alert.alert('Error!!', 'Date is required');
    } else if (date.time === '00:00') {
      Alert.alert('Error!!', 'Time is required');
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(3);
      delete disabledTabs[disabledTabs.indexOf(3)];
      this.setState({ date, completedTabs, disabledTabs, activeTab: 4 });
    }
  }

  onSeatNext = (seat) => {
    if (seat === '' || parseInt(seat, 10) < 1) {
      Alert.alert('Error!!', 'No. of seat must be atleast one');
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(4);
      delete disabledTabs[disabledTabs.indexOf(4)];
      this.setState({ seat, completedTabs, disabledTabs, activeTab: 5 });
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

  createTrip() {
    const { comment, trip, date, seat, share } = this.state;
    try {
      this.props.submit(
        comment.text,
        trip.start,
        trip.end,
        comment.photo,
        trip.stops,
        trip.isReturning,
        date.dates,
        date.time,
        seat,
        date.flexsible,
        share,
      ).then((res) => {
        if (share.general.indexOf('copy_to_clip') > -1) {
          Clipboard.setString(res.data.createTrip.url);
        }

        this.setState({ loading: false, offer: res.data.createTrip });
      })
        .catch(e => console.log(e));
    } catch (error) {
      console.log(error);
    }
  }

  renderFinish() {
    const { loading, offer, share } = this.state;
    if (loading) {
      return (<Loading />);
    }

    return (<Completed offer={offer} isCliped={share.general.indexOf('copy_to_clip') > -1} onButtonPress={this.onButtonPress} />);
  }

  render() {
    const { activeTab, completedTabs, disabledTabs } = this.state;
    const { navigation } = this.props;

    return (
      <Wrapper bgColor="#eded18">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.title}>Back</Text>
        </TouchableOpacity>
        <Container bgColor="#f3f3ed">
          <Text style={styles.mainTitle}>Offer a ride</Text>
          <View style={styles.tabContainer}>
            <Tab
              label="Comment"
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
            {(activeTab === 1) && <Comment onNext={this.onCommentNext} />}
            {(activeTab === 2) && <Trip onNext={this.onTripNext} />}
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
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(submitOffer, connect(mapStateToProps))(Offer);
