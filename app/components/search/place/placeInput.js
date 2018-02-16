import React, { PureComponent } from 'react';
import { View, Modal, Text, StyleSheet, TouchableHighlight } from 'react-native';
import GooglePlacesAutocomplete from '@components/search/place/googlePlacesAutocomplete';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import Countries from '@config/countries';
import _find from 'lodash/find';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    paddingRight: 0,
  },
  inputIconWrapper: {
    height: 50,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  loader: {
    height: 50,
    marginRight: 24,
  },
  placeInput: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
    padding: 12,
    borderRadius: 0,
    flex: 1,
    justifyContent: 'center',
  },
  closeWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
  close: {
    padding: 16,
  },
  closeLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
});

class PlacesInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      value: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      showModal: false,
    });
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({ value: defaultValue });
  }

  onPress = (value) => {
    this.setState({ value, showModal: false }, () => {
      this.props.onChangeText(value);
    });
  }

  getCountryName = (code) => {
    const country = _find(Countries, { code });
    return country.name ? country.name : code;
  }

  getPlaceName = () => {
    const { value } = this.state;
    const { placeholder } = this.props;

    if (value.name) {
      return (
        <View>
          <Text>
            {value.name}
          </Text>
          <Text style={{ color: Colors.text.gray }}>{this.getCountryName(value.countryCode)}</Text>
        </View>
      );
    }

    return (<Text style={{ color: Colors.text.gray }}>{placeholder}</Text>);
  }

  renderModal() {
    const { placeholder, label } = this.props;
    return (
      <Modal
        visible={this.state.showModal}
        onRequestClose={() => this.setState({ showModal: false })}
        animationType="slide"
      >
        <GooglePlacesAutocomplete
          textInputProps={{
            placeholder,
            returnKeyType: 'search',
          }}
          label={label}
          minLength={2}
          onPress={this.onPress}
        />
        <View style={styles.closeWrapper}>
          <TouchableHighlight
            style={styles.close}
            onPress={() => this.setState({ showModal: false })}
          >
            <Text style={styles.closeLabel}>{trans('global.cancel')}</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }

  render() {
    const { inputStyle, height } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.inputWrapper]}>
          <TouchableHighlight
            underlayColor="#f5f5f5"
            style={[styles.placeInput, { height }, { ...inputStyle }]}
            onPress={() => this.setState({ showModal: true })}
          >
            {this.getPlaceName()}
          </TouchableHighlight>
        </View>
        {this.renderModal()}
      </View>
    );
  }
}

PlacesInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape(({
    name: PropTypes.string,
    countryCode: PropTypes.string,
    coordinates: PropTypes.array,
  })),
  height: PropTypes.number,
  label: PropTypes.string,
  inputStyle: TouchableHighlight.propTypes.style,
};

PlacesInput.defaultProps = {
  defaultValue: { name: '', countryCode: '', coordinates: [] },
  height: 60,
  label: '',
  inputStyle: {},
};

export default PlacesInput;
