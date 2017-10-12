import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import GroupItem from '@components/feed/card/group';
import { Loading } from '@components/common';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { withExploreGroup } from '@services/apollo/group';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.background.fullWhite,
    flex: 1,
  },
  header: {
    fontSize: 40,
    lineHeight: 36,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.text.blue,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.cream,
    borderBottomWidth: 2,
    borderTopWidth: 1,
    borderColor: Colors.border.lightGray,
    paddingHorizontal: 10,
  },
  searcchField: {
    height: 40,
    flex: 1,
  },
  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 12,
  },
  listLabel: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  listWrapper: {
    flex: 1,
  },
});

class ExploreGroup extends PureComponent {
  static navigationOptions = {
    header: null,
    title: 'Back',
  };

  constructor(props) {
    super(props);
    this.state = ({ searchQuery: '' });
  }

  redirect = (type, detail) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { group: detail });
  }

  renderFooter = () => {
    const { loading, exploreGroups: { Group, total } } = this.props.exploreGroups;

    if (!loading) return null;

    if (Group.length >= total) {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        >
          <Text>No more group</Text>
        </View>
      );
    }

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <Loading />
      </View>
    );
  }

  renderAllGroups() {
    const { exploreGroups } = this.props;

    if (exploreGroups.networkStatus === 1) {
      return <Loading />;
    }

    if (exploreGroups.error) {
      return <Text>Error: {exploreGroups.error.message}</Text>;
    }

    const { exploreGroups: { Group, total } } = exploreGroups;


    return (
      <FlatList
        data={Group}
        renderItem={({ item }) => <GroupItem min onPress={this.redirect} group={item} />}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        refreshing={exploreGroups.networkStatus === 4}
        onRefresh={() => exploreGroups.refetch()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          if (exploreGroups.loading || Group.length >= total) return;

          exploreGroups.fetchMore({
            variables: { offset: Group.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.exploreGroups.length === 0) {
                return previousResult;
              }

              const prevExploreGroups = previousResult.exploreGroups;
              const updatedGroup = previousResult.exploreGroups.Group.concat(
                fetchMoreResult.exploreGroups.Group,
              );

              return { exploreGroups: { ...prevExploreGroups, ...{ Group: updatedGroup } } };
            },
          });
        }}
      />
    );
  }

  renderSearchGroup = () => {
    const { navigation } = this.props;
    const { searchQuery } = this.state;

    if (searchQuery.length > 0) {
      navigation.navigate('SearchGroup', { query: searchQuery });
    }
  }

  render() {
    return (
      <View style={styles.content}>
        <Text style={styles.header}>EXPLORE GROUPS</Text>
        <View style={styles.searchWrapper}>
          <TextInput
            onChangeText={searchQuery => this.setState({ searchQuery })}
            keyboardType="web-search"
            placeholder="Search for groups"
            style={styles.searcchField}
            underlineColorAndroid="transparent"
            returnKeyType="search"
            onSubmitEditing={this.renderSearchGroup}
          />
          <TouchableOpacity
            onPress={this.renderSearchGroup}
            disabled={this.state.searchQuery.length < 1}
          >
            <Image source={require('@icons/icon_search_blue.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.listLabel}>Popular Group</Text>
        <View style={styles.listWrapper}>
          {this.renderAllGroups()}
        </View>
      </View>
    );
  }
}

ExploreGroup.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  exploreGroups: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    total: PropTypes.numeric,
    networkStatus: PropTypes.number,
    exploreGroups: PropTypes.shape({
      Groups: PropTypes.arrayOf(PropTypes.object),
      total: PropTypes.number,
    }),
  }).isRequired,
};

export default compose(withExploreGroup)(ExploreGroup);
