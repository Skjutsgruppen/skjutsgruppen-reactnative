import React, { Component } from 'react';
import { StyleSheet, Modal, View, ScrollView } from 'react-native';
import { withMyTrips } from '@services/apollo/profile';
import TripsList from '@components/profile/tripsList';
import PropTypes from 'prop-types';
import { Wrapper, NavBar } from '@components/common';
import Colors from '@theme/colors';
import { withShare } from '@services/apollo/auth';
import Share from '@components/common/share';
import { compose } from 'react-apollo';

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
    this.state = ({ isGroup: true, modalDetail: {}, modalType: '', isOpen: false });
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'profile') {
      navigation.navigate('UserProfile', { profileId: detail });
    }

    if (type === 'ask') {
      navigation.navigate('AskDetail', { ask: detail });
    }

    if (type === 'offer') {
      navigation.navigate('OfferDetail', { offer: detail });
    }
  }

  onSharePress = (isGroup) => {
    this.setState({ isOpen: true, isGroup: isGroup !== 'group' });
  };

  onShare = (share) => {
    this.props.share({ id: this.state.modalDetail.id, type: this.state.modalType === 'group' ? 'Group' : 'Trip', share })
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
            showGroup={this.state.modalType !== 'group'}
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

  render() {
    const { userId, type } = this.props.navigation.state.params;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <Trips
            userId={userId}
            type={type}
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
};

export default compose(withShare)(UserTrips);
