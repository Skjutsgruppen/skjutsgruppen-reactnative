import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import JoinGroup from '@components/group/JoinGroup';
import Detail from '@components/group/Detail';
import { withGroup } from '@services/apollo/group';
import NoEnabler from '@components/group/enablers/noEnabler';
import { Loading, DeletedModal } from '@components/common';
import { AppText } from '@components/utils/texts';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { getGroupDetails } from '@services/apollo/dataSync';

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = ({ group: {}, refetch: null, deletedModal: false });
  }

  componentWillMount() {
    const { navigation, subscribeToGroup } = this.props;
    const { id } = navigation.state.params;
    const group = getGroupDetails(id);

    this.setState({ group });

    subscribeToGroup(id);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillReceiveProps({ group, loading, refetch }) {
    if (!loading && group && group.isDeleted) {
      this.setState({ deletedModal: true });
    }

    if (!loading && group.id) {
      this.setState({ group, loading, refetch });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { navigation, nav } = this.props;

    if (nav && nav.routes.length <= 1) {
      navigation.replace('Tab');
    } else {
      navigation.goBack();
    }

    return true;
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

  renderDeletedModal = () => {
    const { deletedModal } = this.state;
    const { navigation } = this.props;

    const message = (
      <AppText>This group has been deleted.</AppText>
    );

    return (
      <DeletedModal
        visible={deletedModal}
        onRequestClose={() => this.setState({ deletedModal: false })}
        message={message}
        onConfirm={() => this.setState({ deletedModal: false }, () => navigation.popToTop())}
      />
    );
  }

  renderGroup = () => {
    const { group } = this.state;
    const { navigation } = this.props;
    const { notifier, notificationMessage } = navigation.state.params;

    if (group.isDeleted) {
      return null;
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

  render() {
    const { group } = this.state;

    if (Object.keys(group).length < 1) {
      return <Loading />;
    }

    return (
      <View style={{ flex: 1 }}>
        {!group.isDeleted && this.renderGroup()}
        {this.renderDeletedModal()}
      </View>
    );
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
  subscribeToGroup: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    routes: PropTypes.array,
  }).isRequired,
};

GroupDetail.defaultProps = {
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToGroup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ nav: state.nav });

const GroupWithDetail = compose(connect(mapStateToProps), withGroup)(GroupDetail);

const GroupScreen = ({ navigation }) => {
  const { id } = navigation.state.params;
  return (<GroupWithDetail id={id} navigation={navigation} />);
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
