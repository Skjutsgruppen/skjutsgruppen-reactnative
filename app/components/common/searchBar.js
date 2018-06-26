import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, TextInput, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableHighlight from '@components/touchableHighlight';

import Colors from '@theme/colors';

const styles = StyleSheet.create({
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowColor: '#000',
  },
  searchIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
  searchInput: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    height: 36,
    paddingVertical: 4,
    flex: 1,
    borderRadius: 18,
    paddingLeft: 0,
    marginRight: 16,
  },
  clear: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  content: {
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 100,
  },
});

class SearchBar extends PureComponent {
  input = null;

  handleClose = () => {
    const { onPressClose } = this.props;
    onPressClose();
    this.input.blur();
  }
  render() {
    const {
      style,
      onChange,
      placeholder,
      defaultValue,
      onSubmitSearch,
      onFocus,
      onBlur,
    } = this.props;
    return (
      <View style={[styles.searchInputWrapper, style]}>
        <Image
          source={require('@assets/icons/ic_search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChangeText={text => onChange(text)}
          underlineColorAndroid="transparent"
          style={styles.searchInput}
          returnKeyType="done"
          onSubmitEditing={onSubmitSearch}
          onFocus={() => onFocus(true)}
          onBlur={() => onBlur(false)}
          allowFontScaling={false}
          ref={(input) => { this.input = input; }}
        />
        <TouchableHighlight onPress={this.handleClose}>
          <View style={styles.clear}>
            <Icon
              name="ios-close"
              size={32}
              style={{ color: Colors.text.gray }}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

SearchBar.propTypes = {
  style: ViewPropTypes.style,
  onChange: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  onSubmitSearch: PropTypes.func,
  defaultValue: PropTypes.string,
  onPressClose: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

SearchBar.defaultProps = {
  style: {},
  onChange: () => { },
  defaultValue: '',
  onSubmitSearch: null,
  onPressClose: null,
  onFocus: () => {},
  onBlur: () => {},
};

export default SearchBar;
