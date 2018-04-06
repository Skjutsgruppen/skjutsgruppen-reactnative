import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import { Heading } from '@components/utils/texts';
import { Wrapper } from '@components/common';
import PropTypes from 'prop-types';
import SearchList from '@components/message/searchList';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
    marginTop: 42,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
  },
  searchIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
  searchInput: {
    fontSize: 15,
    height: 36,
    flex: 1,
    fontFamily: 'SFUIText-Regular',
    borderRadius: 18,
    paddingLeft: 0,
    marginRight: 16,
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
        <LinearGradient colors={['#fff', '#ededf9']} style={styles.header}>
          <Heading style={styles.title}>{trans('message.messages_and_group')}</Heading>
          <View style={styles.searchInputWrapper}>
            <Image
              source={require('@assets/icons/ic_search.png')}
              style={styles.searchIcon}
            />
            <TextInput
              onChangeText={query => this.setState({ query })}
              placeholder="Search"
              underlineColorAndroid="transparent"
              style={styles.searchInput}
              returnKeyType="search"
              autoFocus
              onSubmitEditing={this.searchMessages}
            />
          </View>
        </LinearGradient>
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
