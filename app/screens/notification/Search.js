import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import Colors from '@theme/colors';
import { Wrapper } from '@components/common';
import PropTypes from 'prop-types';
import SearchList from '@components/message/searchList';

const styles = StyleSheet.create({
  header: {
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
  },
  iconWrapper: {
    height: 36,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  searchInput: {
    fontSize: 14,
    height: 36,
    flex: 1,
    paddingLeft: 18,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
});

class MessageSearch extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { query: '', searchQuery: '' };
  }

  searchMessages = () => {
    const { query } = this.state;
    this.setState({ searchQuery: query });
  }

  render() {
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Messages</Text>
          <View style={styles.searchInputWrapper}>
            <TextInput
              onChangeText={query => this.setState({ query })}
              placeholder="Search"
              underlineColorAndroid="transparent"
              style={styles.searchInput}
              returnKeyType="search"
              autoFocus
              onSubmitEditing={this.searchMessages}
            />
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={this.searchMessages}
              disabled={this.state.query.length < 1}
            >
              <Image
                source={require('@assets/icons/icon_search_blue.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          {
            this.state.searchQuery.length > 0 &&
            <SearchList navigation={this.props.navigation} keyword={this.state.searchQuery} />
          }
        </View>
      </Wrapper>
    );
  }
}

MessageSearch.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default MessageSearch;
