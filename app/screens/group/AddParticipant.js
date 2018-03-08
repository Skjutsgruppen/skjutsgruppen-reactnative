import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import List from '@components/group/participant/addParticipantList';

class AddParticipant extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    if (!navigation.state.params && !navigation.state.params.group) {
      return null;
    }
    const { group } = navigation.state.params;

    return (<List group={group} />);
  }
}

AddParticipant.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        group: PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
      }),
    }),
  }).isRequired,
};

export default AddParticipant;
