import React, { Component } from 'react';
import PropTypes from 'prop-types';
import JoinGroup from '@components/group/JoinGroup';
import Detail from '@components/group/Detail';
import { withGroup } from '@services/apollo/group';
import NoEnabler from '@components/group/enablers/noEnabler';
import { Loading } from '@components/common';

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = ({ group: {}, refetch: null, fetch: false });
  }

  componentWillMount() {
    const { navigation, fetch, subscribeToGroup } = this.props;
    const { group } = navigation.state.params;
    this.setState({ group, fetch });

    subscribeToGroup(group.id);
  }

  componentWillReceiveProps({ group, loading, refetch }) {
    if (!loading && group.id) {
      this.setState({ group, loading, refetch, fetch: false });
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
    const { group } = this.state;

    if (group.membershipStatus === 'accepted') {
      return true;
    }

    return false;
  }

  render() {
    const { group, fetch } = this.state;
    const { navigation } = this.props;
    const { notifier, notificationMessage } = navigation.state.params;

    if (fetch) {
      return <Loading />;
    }

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
  fetch: PropTypes.bool,
  subscribeToGroup: PropTypes.func.isRequired,
};

GroupDetail.defaultProps = {
  fetch: false,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};


const GroupWithDetail = withGroup(GroupDetail);

const GroupScreen = ({ navigation }) => {
  const { group, fetch } = navigation.state.params;
  return (<GroupWithDetail id={group.id} navigation={navigation} fetch={fetch || false} />);
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
