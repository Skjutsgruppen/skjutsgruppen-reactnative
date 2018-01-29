import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Loading } from '@components/common';
import { withNavigation } from 'react-navigation';
import CapturedImage from '@components/experience/capturedImage';
import Colors from '@theme/colors';
import Date from '@components/date';
import Button from '@components/experience/button';
import { compose } from 'react-apollo';
import { withAcceptExperience, withRejectExperience } from '@services/apollo/experience';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  infoSection: {
    padding: 24,
    backgroundColor: Colors.background.fullWhite,
  },
  block: {
    paddingVertical: 12,
  },
  name: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  notificationWrapper: {
    height: 75,
    justifyContent: 'center',
    backgroundColor: '#F4F2FC',
    paddingHorizontal: 16,
    elevation: 5,
  },
  notificationText: {
    color: '#000',
    textAlign: 'center',
  },
  experienceTagActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '5%',
    paddingHorizontal: 24,
    borderColor: Colors.border.lightGray,
    backgroundColor: Colors.background.fullWhite,
    borderTopWidth: 1,
  },
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '5%',
    paddingHorizontal: 24,
    borderColor: Colors.border.lightGray,
    backgroundColor: Colors.background.fullWhite,
    borderTopWidth: 1,
  },
});

class AcceptExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: {},
      actionLoading: false,
    };
  }

  componentWillMount() {
    const { experience } = this.props;

    this.setState({ experience });
  }

  componentWillReceiveProps({ experience }) {
    this.setState({ experience });
  }

  redirect = () => {
    const { navigation } = this.props;

    navigation.goBack();
  }

  experienceTagAction = (status) => {
    const { id } = this.state.experience;
    const { refresh, acceptExperience, rejectExperience } = this.props;

    if (status) {
      this.setState({ actionLoading: true }, () => acceptExperience(id)
        .then(refresh)
        .then(() => this.setState({ actionLoading: false }))
        .catch(() => this.setState({ actionLoading: false })));
    } else {
      this.setState({ actionLoading: true }, () => rejectExperience(id)
        .then(refresh)
        .then(() => this.setState({ actionLoading: false }))
        .then(this.redirect())
        .catch(() => this.setState({ actionLoading: false })));
    }
  }

  renderTagActionButton = () => {
    const { actionLoading } = this.state;

    if (actionLoading) {
      return (
        <View style={styles.loadingWrapper}>
          <Loading />
        </View>);
    }

    return (
      <View style={styles.experienceTagActions}>
        <Button onPress={() => this.experienceTagAction(true)} label="Yes!" />
        <Button onPress={() => this.experienceTagAction(false)} label="No" />
      </View>
    );
  }

  renderTagRejectedButton = () => {
    const { navigation } = this.props;

    return (
      <View style={styles.experienceTagActions}>
        <Button onPress={navigation.goBack()} label="Proceed" />
      </View>
    );
  }

  renderParticipants = () => {
    const { navigation } = this.props;
    const { experience } = this.state;
    if (!experience.Trip) {
      return null;
    }

    const going = experience.Participants.filter(row => row.status === 'accepted');
    return going.map((row, index) => {
      let separator = ' ';
      if (index === (going.length - 2)) {
        separator = ' and ';
      } else if (index < (going.length - 1)) {
        separator = ', ';
      }

      return (<Text key={row.User.id}>
        <Text
          onPress={() => navigation.navigate('UserProfile', { profileId: row.User.id })}
          style={styles.name}
        >
          {row.User.firstName}
        </Text>
        {separator}
      </Text>);
    });
  }

  renderTripInfo = () => {
    const { experience } = this.state;

    if (!experience.Trip) {
      return null;
    }

    return (
      <Text onPress={this.redirectTrip}>
        <Text>
          went from {experience.Trip.TripStart.name} to {experience.Trip.TripEnd.name} on <Date format="MMM DD, YYYY">{experience.Trip.date}</Date>
          . <Text style={styles.name}>See their trip here</Text>
        </Text>
      </Text>
    );
  }

  render() {
    const { experience } = this.state;
    let image = null;

    if (experience.photo) {
      image = (<CapturedImage imageURI={experience.photo} />);
    }

    const { loading } = this.props;

    return (
      <View style={styles.flex}>
        <View style={styles.notificationWrapper}>
          <Text style={styles.notificationText}>Are you in this Experience?</Text>
        </View>
        <ScrollView style={styles.flex}>
          {image}
          <View style={styles.infoSection}>
            <View style={styles.block}>
              <Text>Participants</Text>
            </View>
            <View style={styles.block}>
              {loading && <Loading />}
              <Text>
                {this.renderParticipants()}
                {this.renderTripInfo()}
              </Text>
            </View>
            <View style={styles.block}>
              <Text>
                {experience.description}
              </Text>
            </View>
          </View>
        </ScrollView>
        {this.renderTagActionButton()}
      </View>
    );
  }
}

AcceptExperience.propTypes = {
  acceptExperience: PropTypes.func.isRequired,
  rejectExperience: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  refresh: PropTypes.func.isRequired,
  experience: PropTypes.shape({
    Participants: PropTypes.array,
    Trip: PropTypes.object,
    User: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
    }),
  }),
};

AcceptExperience.defaultProps = {
  loading: true,
  experience: {},
};

export default compose(
  withNavigation,
  withAcceptExperience,
  withRejectExperience,
)(AcceptExperience);
