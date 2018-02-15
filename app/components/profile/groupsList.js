import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Modal } from 'react-native';
import DataList from '@components/dataList';
import GroupsItem from '@components/profile/groupsItem';
import { ListSearchBar } from '@components/common';
import ListSearchModal from '@components/profile/ListSearchModal';
import { withNavigation } from 'react-navigation';

class UsersGroupsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  componentWillMount() {
    const { subscribeToNewGroup, id } = this.props;
    subscribeToNewGroup({ userId: id });
  }


  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'profile') {
      navigation.navigate('Profile', { profileId: detail });
    }

    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
    }
    this.onClose();
  }

  onSearchPress = () => {
    this.setState({ isOpen: true });
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  renderSearchModal = () => {
    const { id } = this.props;

    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ListSearchModal
          id={id}
          onPress={this.onPress}
          onClose={this.onClose}
          searchCategory="groups"
        />
      </Modal>
    );
  }

  renderListSearch = () => {
    const { groups } = this.props;

    if (groups.count > 0) {
      return (<ListSearchBar onSearchPress={this.onSearchPress} />);
    }

    return null;
  }

  renderDataList = () => {
    const { groups } = this.props;

    return (
      <DataList
        data={groups}
        header={this.renderListSearch}
        renderItem={({ item }) => (
          <GroupsItem
            key={item.id}
            group={item}
            onPress={this.onPress}
          />
        )}
        fetchMoreOptions={{
          variables: { offset: groups.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.groups.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.groups.rows.concat(fetchMoreResult.groups.rows);

            return { groups: { ...previousResult.groups, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    return (<View>
      {this.renderDataList()}
      {this.renderSearchModal()}
    </View>);
  }
}

UsersGroupsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  groups: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  id: PropTypes.number.isRequired,
  subscribeToNewGroup: PropTypes.func.isRequired,
};

export default withNavigation(UsersGroupsList);
