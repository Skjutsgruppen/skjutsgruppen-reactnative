import React, { PureComponent } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { withConversation } from '@services/apollo/profile';
import { Wrapper, ListSearchBar } from '@components/common';
import ToolBar from '@components/utils/toolbar';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import ListItem from '@components/profile/listItem';
import { FEEDABLE_TRIP, FEEDABLE_GROUP } from '@config/constant';
import PropTypes from 'prop-types';
import ListSearchModal from '@components/profile/ListSearchModal';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
  },
});

class UserConversation extends PureComponent {
  static navigationOptions = {
    header: null,
  };

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

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { trip: detail });
    }

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { group: detail });
    }
    this.onClose();
  }

  onExperienceIconPress = (experience) => {
    const { navigation } = this.props;
    this.onClose();
    navigation.navigate('ExperienceDetail', { experience });
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

  render() {
    const { conversations } = this.props;
    const { username } = this.props.navigation.state.params;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ToolBar title={`Rides ${username} talked about`} />
        <View style={styles.listWrapper}>
          <DataList
            data={conversations}
            header={this.renderListSearch}
            renderItem={({ item }) =>
              (<ListItem
                trip={item}
                onPress={this.onPress}
                onExperiencePress={this.onExperienceIconPress}
              />)
            }
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
};

export default withConversation(UserConversation);
