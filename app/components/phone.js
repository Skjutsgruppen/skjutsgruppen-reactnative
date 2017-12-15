import React, { PureComponent } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import countries from '@config/countries';
import Picker from '@components/picker';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
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

  onChange = (value) => {
    this.setState({ number: value }, () => {
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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Picker
              defaultValue={this.state.code}
              list={list}
              onChange={countryCode => this.setState({ countryCode })}
            />
          </View>
          <View style={{ flex: 4 }}>
            <TextInput
              keyboardType="phone-pad"
              underlineColorAndroid="transparent"
              onChangeText={this.onChange}
              {...rest}
            />
          </View>
        </View>
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
