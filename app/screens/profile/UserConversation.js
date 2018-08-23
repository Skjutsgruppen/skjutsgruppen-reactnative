import React, { PureComponent } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { withConversation } from '@services/apollo/profile';
import { Wrapper, ListSearchBar } from '@components/common';
import ToolBar from '@components/utils/toolbar';
import Colors from '@theme/colors';
import PortionList from '@components/portionList';
import ListItem from '@components/profile/listItem';
import { FEEDABLE_TRIP, FEEDABLE_GROUP, FEEDABLE_PROFILE } from '@config/constant';
import PropTypes from 'prop-types';
import ListSearchModal from '@components/profile/ListSearchModal';
import StickySectionHeader from '@components/profile/stickySectionHeader';
import SectionDivider from '@components/profile/sectionDivider';
import { trans } from '@lang/i18n';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
  },
  searchWrapper: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  loadingWrapper: {
    paddingVertical: 50,
  },
});

class UserConversation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  onSearchPress = () => {
    this.setState({ isOpen: true });
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onPress = (type, { id }) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { id });
    }

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { id });
    }

    if (type === FEEDABLE_PROFILE) {
      navigation.navigate('Profile', { profileId: id });
    }

    this.onClose();
  }

  onExperienceIconPress = ({ id }) => {
    const { navigation } = this.props;
    this.onClose();
    navigation.navigate('ExperienceDetail', { id });
  }

  isCurrentUser = () => {
    const { navigation, user } = this.props;
    const { userId } = navigation.state.params;

    return user.id === userId;
  }

  renderSearchModal = () => (
    <Modal
      visible={this.state.isOpen}
      onRequestClose={() => this.setState({ isOpen: false })}
      animationType="slide"
    >
      <ListSearchModal
        onPress={this.onPress}
        onClose={this.onClose}
        onExperienceIconPress={this.onExperienceIconPress}
        searchCategory="conversations"
      />
    </Modal>
  )

  renderListSearch = () => {
    const { conversations } = this.props;

    if (conversations.count > 0) {
      return (<ListSearchBar onSearchPress={this.onSearchPress} />);
    }

    return null;
  }

  renderSectionList = () => {
    const { conversations } = this.props;

    return (
      <PortionList
        data={conversations}
        renderItem={({ item }) => (
          item.isBlocked ?
            null :
            <ListItem
              showIndicator
              indicatorColor={item.type === 'offered' ? Colors.background.pink : Colors.background.blue}
              trip={item}
              onPress={this.onPress}
              onExperiencePress={this.onExperienceIconPress}
            />
        )}
        listHeader={this.renderListSearch}
        sectionHeader={
          ({ section }) => <StickySectionHeader label={section.title} />
        }
        sectionFooter={() => <SectionDivider />}
        stickySectionHeader
        fetchMoreOptions={{
          variables: { offset: conversations.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.conversations.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.conversations.rows.concat(
              fetchMoreResult.conversations.rows,
            );

            return { conversations: { ...previousResult.conversations, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    const { username } = this.props.navigation.state.params;
    const user = this.isCurrentUser() ? trans('profile.I') : (username || this.props.user.firstName);

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar title={trans('profile.rides_user_talked_about', { user })} />
        <View style={styles.listWrapper}>
          {this.renderSectionList()}
          {this.renderSearchModal()}
        </View>
      </Wrapper>
    );
  }
}

UserConversation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.object,
    goBack: PropTypes.func,
  }).isRequired,
  conversations: PropTypes.shape({
    rows: PropTypes.array,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const RenderUserConversation = compose(
  withConversation,
  connect(mapStateToProps),
)(UserConversation);

const UserConversationScreen = ({ navigation }) => {
  const { userId } = navigation.state.params;

  return (<RenderUserConversation navigation={navigation} id={userId} />);
};

UserConversationScreen.navigationOptions = {
  header: null,
};

UserConversationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.object,
    goBack: PropTypes.func,
  }).isRequired,
};

export default UserConversationScreen;
