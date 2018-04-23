import React, { Component } from 'react';
import ToolBar from '@components/utils/toolbar';
import GroupsList from '@components/profile/groupsList';
import { withMyGroups } from '@services/apollo/group';
import PropTypes from 'prop-types';
import { Wrapper } from '@components/common';
import Colors from '@theme/colors';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';

const Groups = withMyGroups(GroupsList);

class UserGroups extends Component {
  static navigationOptions = {
    header: null,
  };

  isCurrentUser = () => {
    const { navigation, user } = this.props;
    const { userId } = navigation.state.params;

    return user.id === userId;
  }

  render() {
    const { userId, username } = this.props.navigation.state.params || this.props.user.id;
    const user = this.isCurrentUser() ? trans('profile.my') : trans('profile.username_s', { name: username || this.props.user.firstName });

    return (
      <Wrapper bgColor={Colors.background.creme}>
        <ToolBar title={trans('profile.user_groups', { user })} />
        <Groups id={userId} />
      </Wrapper>
    );
  }
}

UserGroups.propTypes = {
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

export default connect(mapStateToProps)(UserGroups);
