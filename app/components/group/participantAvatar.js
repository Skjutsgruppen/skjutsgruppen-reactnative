import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DetailedAvatar from '@components/group/detailedAvatar';

class ParticipantAvatar extends Component {
  componentWillMount() {
    const { subscribeToUpdatedGroupMember, id, enabler } = this.props;
    subscribeToUpdatedGroupMember({ id, enabler });
  }

  onAvatarPress = () => {
    const { onPress, enabler } = this.props;
    if (enabler) {
      onPress('EnablerList');
    } else {
      onPress('Participants');
    }
  }

  numberText = () => {
    const { groupMembers: { count }, enabler, displayNumber } = this.props;

    if (!displayNumber) return '';

    if (enabler) {
      return count > 1 ? `${count} ENABLERS` : `${count} ENABLER`;
    }

    return count > 1 ? `${count} PARTICIPANTS` : `${count} PARTICIPANT`;
  }

  render() {
    const { groupMembers: { count, rows, loading } } = this.props;

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

ParticipantAvatar.propTypes = {
  id: PropTypes.number.isRequired,
  groupMembers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      avatar: PropTypes.string,
    })),
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  subscribeToUpdatedGroupMember: PropTypes.func.isRequired,
  enabler: PropTypes.bool.isRequired,
  displayNumber: PropTypes.bool,
};

ParticipantAvatar.defaultProps = {
  displayNumber: true,
};

export default ParticipantAvatar;
