import React, { Component } from 'react';
import { StyleSheet, Modal, View, ScrollView } from 'react-native';
import { withMyTrips } from '@services/apollo/trip';
import { withShare } from '@services/apollo/share';
import TripsList from '@components/profile/tripsList';
import PropTypes from 'prop-types';
import { Wrapper, NavBar } from '@components/common';
import Colors from '@theme/colors';
import Share from '@components/common/share';
import { compose } from 'react-apollo';
import { FEEDABLE_TRIP, FEEDABLE_PROFILE } from '@config/constant';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingBottom: 12,
  },
});

const Trips = withMyTrips(TripsList);

class UserTrips extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ isOpen: false, trip: {} });
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { trip: detail });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('UserProfile', { profileId: detail });
    }
  }

  onSharePress = (type, trip) => {
    this.setState({ isOpen: true, trip });
  };

  onShare = (share) => {
    this.props.share({ id: this.state.trip.id, type: FEEDABLE_TRIP, share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderShareModal() {
    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ScrollView>
          <Share
            modal
            showGroup
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

  render() {
    const { userId } = this.props.navigation.state.params || this.props.user.id;
    const { type } = this.props.navigation.state.params;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <Trips
            id={userId}
            type={type}
            active={null}
            onPress={this.onPress}
            onSharePress={this.onSharePress}
          />
        </View>
        {this.renderShareModal()}
      </Wrapper>
    );
  }
}

UserTrips.propTypes = {
  share: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.numeric,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withShare, connect(mapStateToProps))(UserTrips);
