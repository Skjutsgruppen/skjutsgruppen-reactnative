import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DetailedAvatar from '@components/group/detailedAvatar';

class MembershipRequestAvatar extends Component {
  componentWillMount() {
    const { id, subscribeToNewRequest } = this.props;
    subscribeToNewRequest({ id });
  }

  onAvatarPress = () => {
    const { onPress } = this.props;
    onPress('MembershipRequest');
  }

  numberText = () => {
    const { membershipRequest } = this.props;

    return `${membershipRequest.count} ASKING TO PARTICIPATE`;
  }

  render() {
    const { membershipRequest: { rows, count, loading } } = this.props;

    if (count < 1) {
      return null;
    }

    return (
      <DetailedAvatar
        count={count}
        rows={rows}
        loading={loading}
        numberText={this.numberText()}
        onPress={this.onAvatarPress}
      />
    );
  }
}

MembershipRequestAvatar.propTypes = {
  id: PropTypes.number.isRequired,
  membershipRequest: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.shape({
          id: PropTypes.number,
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          avatar: PropTypes.string,
        }).isRequired,
      }),
    ).isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  subscribeToNewRequest: PropTypes.func.isRequired,
};

export default MembershipRequestAvatar;
