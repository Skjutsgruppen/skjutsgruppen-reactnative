import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { Wrapper, NavBar } from '@components/common';
import PropTypes from 'prop-types';
import { withExploreGroup } from '@services/apollo/group';
import Colors from '@theme/colors';
import ExploreGroupResult from '@components/group/exploreGroupList';

const ExploreGroupList = withExploreGroup(ExploreGroupResult);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  header: {
    fontSize: 40,
    lineHeight: 36,
    paddingHorizontal: 20,
    paddingTop: 40,
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
  },
  searcchField: {
    height: 40,
    flex: 1,
    paddingLeft: 24,
  },
  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 12,
    marginRight: 24,
  },
});

class ExploreGroup extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({ searchQuery: '' });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
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
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
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
              <Image source={require('@assets/icons/icon_search_blue.png')} style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
          <ExploreGroupList from={null} filter="popular" />
        </View>
      </Wrapper>
    );
  }
}

ExploreGroup.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default ExploreGroup;
