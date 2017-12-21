import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import JoinGroup from '@components/new/group/JoinGroup';
import Detail from '@components/group/Detail';
import { withFindGroup } from '@services/apollo/group';
import { Loading } from '@components/common';

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: true, group: {}, refetch: null });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { group } = navigation.state.params;
    this.setState({ loading: false, group });
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
    if (user.id === group.User.id) {
      return true;
    }

    let isMember = false;

    group.GroupMembers.forEach((member) => {
      if (member && member.id === user.id) {
        isMember = true;
      }
    });

    return isMember;
  }

  render() {
    const { navigation } = this.props;
    if (this.state.loading) {
      return (<Loading />);
    }

    if (this.isMember()) {
      return (<Detail
        refresh={this.refresh}
        group={this.state.group}
        navigation={navigation}
      />);
    }

    return (<JoinGroup
      refresh={this.refresh}
      group={this.state.group}
      navigation={navigation}
    />);
  }
}

GroupDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const GroupWithDetail = withFindGroup(connect(mapStateToProps)(GroupDetail));

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
