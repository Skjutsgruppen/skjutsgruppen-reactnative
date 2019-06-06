import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import PropTypes from 'prop-types';
import JoinGroup from '@components/group/JoinGroup';
import Detail from '@components/group/Detail';
import { withGroup } from '@services/apollo/group';
import NoEnabler from '@components/group/enablers/noEnabler';
import { Loading, InfoModal } from '@components/common';
import { AppText } from '@components/utils/texts';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { getGroupDetails } from '@services/apollo/dataSync';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';

class GroupDetail extends Component {
  constructor(props) {
    super(props);
    this.state = ({ group: {}, refetch: null, deletedModal: false, notAvailableModal: false });
    this.isNotAvailableModalDisplayed = false;
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
    if (!loading && group && group.isBlocked) {
      this.setState({ notAvailableModal: true });
    }

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

  navigateOnDelete = () => {
    const { navigation } = this.props;
    navigation.popToTop();
    navigation.replace('Tab');
  }

  renderDeletedModal = () => {
    const { deletedModal } = this.state;

    const message = (
      <AppText>This group has been deleted.</AppText>
    );

    return (
      <InfoModal
        visible={deletedModal}
        onRequestClose={() => this.setState({ deletedModal: false })}
        message={message}
        onConfirm={() => this.setState({ deletedModal: false }, () => this.navigateOnDelete())}
      />
    );
  }

  renderGroupNotAvailable = () => {
    const { notAvailableModal } = this.state;
    const { navigation } = this.props;

    const message = (<AppText>{trans('group.group_not_available')}</AppText>);

    return (
      <InfoModal
        visible={notAvailableModal && !this.isNotAvailableModalDisplayed}
        onRequestClose={() => this.setState({ notAvailableModal: false })}
        message={message}
        onConfirm={() => this.setState({ notAvailableModal: false },
          () => { this.isNotAvailableModalDisplayed = true; navigation.goBack(); })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderGroup = () => {
    const { group } = this.state;
    console.log(group, '==========inside render', group);
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
        {/* {console.log(group)} */}
        {/* {console.log(!group.isDeleted && !group.isBlocked && this.renderGroup())} */}
        {this.renderGroup()}
        {this.renderDeletedModal()}
        {this.renderGroupNotAvailable()}
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
  console.log('groupscreen ==== ', navigation.state.params);
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
