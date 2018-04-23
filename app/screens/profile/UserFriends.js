import React, { Component } from 'react';
import ToolBar from '@components/utils/toolbar';
import FriendsList from '@components/profile/friendsList';
import { withFriends } from '@services/apollo/friend';
import PropTypes from 'prop-types';
import { Wrapper } from '@components/common';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';

const Friends = withFriends(FriendsList);

class UserFriends extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { id, username } = this.props.navigation.state.params || this.props.user.id;
    const title = username || this.props.user.firstName;

    return (
      <Wrapper>
        <ToolBar title={trans('profile.users_friends', { username: title })} />
        <Friends id={id} />
      </Wrapper>
    );
  }
}

UserFriends.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(UserFriends);
