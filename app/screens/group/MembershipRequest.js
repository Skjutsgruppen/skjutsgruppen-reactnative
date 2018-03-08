import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import MembershipRequestList from '@components/group/membershipRequest/membershipRequestList';
import { withGroupMembershipRequest } from '@services/apollo/group';

const RequestList = withGroupMembershipRequest(MembershipRequestList);

class MembershipRequest extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    if (!navigation.state.params && navigation.state.params.id) {
      return null;
    }

    const { id } = navigation.state.params;

    return (<RequestList id={id} />);
  }
}

MembershipRequest.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default MembershipRequest;
