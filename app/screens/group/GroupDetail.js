import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import JoinGroup from '@components/group/JoinGroup';
import Detail from '@components/group/Detail';
import { withGroup } from '@services/apollo/group';
import NoEnabler from '@components/group/enablers/noEnabler';

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = ({ group: {}, refetch: null });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { group } = navigation.state.params;
    this.setState({ group });
  }

  componentWillReceiveProps({ group, loading, refetch }) {
    if (!loading && group.id) {
      this.setState({ group, loading, refetch });
    }
  }

  refresh = () => {
    const { refetch } = this.state;

    if (typeof refetch === 'function') {
      return refetch();
    }
    return null;
  }

  isMember = () => {
    const { user } = this.props;
    const { group } = this.state;

    if (user.id === group.User.id || group.membershipStatus === 'accepted') {
      return true;
    }

    return false;
  }

  render() {
    const { group } = this.state;
    const { navigation } = this.props;
    const { notifier, notificationMessage } = navigation.state.params;

    if (this.isMember()) {
      if (group.Enablers.length < 1) {
        return <NoEnabler group={group} onAdd={this.refresh} />;
      }

      return (
        <Detail
          refresh={this.refresh}
          group={group}
          notifier={notifier}
          notificationMessage={notificationMessage}
        />);
    }

    return (
      <JoinGroup
        refresh={this.refresh}
        group={group}
      />);
  }
}

GroupDetail.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const GroupWithDetail = withGroup(connect(mapStateToProps)(GroupDetail));

const GroupScreen = ({ navigation }) => {
  const { group } = navigation.state.params;
  return (<GroupWithDetail id={group.id} navigation={navigation} />);
};

GroupScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

GroupScreen.navigationOptions = {
  header: null,
};

export default GroupScreen;
