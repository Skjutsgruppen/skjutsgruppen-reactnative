import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ParticipantsList from '@components/group/participant/participantList';
import { withGroupMembers } from '@services/apollo/group';

const ParticipantLists = withGroupMembers(ParticipantsList);

class Participants extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    if (!navigation.state.params && navigation.state.params.id) {
      return null;
    }

    const { group } = navigation.state.params;

    return (<ParticipantLists id={group.id} isAdmin={group.isAdmin} />);
  }
}

Participants.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        group: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          isAdmin: PropTypes.bool.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default Participants;
