import React, { PureComponent } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import countries from '@config/countries';
import Picker from '@components/picker';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  pickerWrapper: {
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingLeft: 22,
    backgroundColor: Colors.background.mutedBlue,
    justifyContent: 'center',
    marginRight: 16,
  },
  input: {
    fontFamily: 'SFUIText-Regular',
    flex: 1,
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingHorizontal: 30,
    backgroundColor: Colors.background.mutedBlue,
  },
});

class Phone extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({ code: '', number: '' });
  }
  componentWillMount() {
    this.setState({ code: this.props.defaultCode });
  }

  onChangePhoneNumber = (value) => {
    this.setState({ number: value }, () => {
      const { code, number } = this.state;
      this.props.onChange({ code, number });
    });
  }

  onChangeCountryCode = (value) => {
    this.setState({ code: value }, () => {
      const { code, number } = this.state;
      this.props.onChange({ code, number });
    });
  }

  getList = () => countries.map(country => ({
    key: country.dialCode,
    value: `${country.dialCode} - ${country.name}`,
  }));

  render() {
    const { ...rest } = this.props;
    const list = this.getList();
    return (
      <View style={styles.wrapper}>
        <View style={styles.pickerWrapper}>
          <Picker
            defaultValue={this.state.code}
            list={list}
            onChange={this.onChangeCountryCode}
          />
        </View>
        <TextInput
          keyboardType="phone-pad"
          underlineColorAndroid="transparent"
          onChangeText={this.onChangePhoneNumber}
          style={styles.input}
          {...rest}
        />
      </View>
    );
  }
}

Phone.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultCode: PropTypes.string,
};

Phone.defaultProps = {
  defaultCode: '',
};


export default Phone;
