import React, { PureComponent } from 'react';
import { View, Modal, Text, StyleSheet, TouchableHighlight } from 'react-native';
import GooglePlacesAutocomplete from '@components/search/place/googlePlacesAutocomplete';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import Countries from '@config/countries';
import _find from 'lodash/find';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'sfuiTextRegular',
  },
  lightText: {
    color: Colors.text.gray,
  },
  inputWrapper: {
    flexDirection: 'row',
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
    paddingVertical: 12,
    paddingHorizontal: 20,
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
    fontFamily: 'sfuiTextBold',
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
});

class PlacesInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      place: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      showModal: false,
    });
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({ place: defaultValue });
  }

  componentWillReceiveProps({ defaultValue }) {
    this.setState({ place: defaultValue });
  }

  onPress = ({ place, source }) => {
    this.setState({ place, showModal: false }, () => {
      this.props.onChangeText({ place, source });
    });
  }

  getCountryName = (code) => {
    const country = _find(Countries, { code });
    return country.name ? country.name : code;
  }

  getPlaceName = () => {
    const { place } = this.state;
    const { placeholder } = this.props;

    if (place.name) {
      return (
        <View>
          <Text style={styles.text} >{place.name}</Text>
          <Text style={[styles.text, styles.lightText]}>
            {this.getCountryName(place.countryCode)}
          </Text>
        </View>
      );
    }

    return (<Text style={[styles.text, styles.lightText]}>{placeholder}</Text>);
  }

  renderModal() {
    const { placeholder, label, direction, currentLocation } = this.props;
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
          direction={direction}
          currentLocation={currentLocation}
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
    const { wrapperStyle, inputStyle, height } = this.props;

    return (
      <View style={wrapperStyle}>
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
  wrapperStyle: TouchableHighlight.propTypes.style,
  direction: PropTypes.bool,
  currentLocation: PropTypes.bool,
};

PlacesInput.defaultProps = {
  defaultValue: { name: '', countryCode: '', coordinates: [] },
  height: 60,
  label: '',
  inputStyle: {},
  direction: false,
  currentLocation: false,
  wrapperStyle: {},
};

export default PlacesInput;
