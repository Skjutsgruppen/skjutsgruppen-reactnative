import React, { PureComponent } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import GooglePlacesAutocomplete from '@components/search/place/googlePlacesAutocomplete';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import Countries from '@config/countries';
import _find from 'lodash/find';
import { trans } from '@lang/i18n';

import TouchableHighlight from '@components/touchableHighlight';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
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
    backgroundColor: Colors.background.fullWhite,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
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
      directionText: null,
      direction: null,
    });
  }

  componentWillMount() {
    const { defaultValue, defaultDirection } = this.props;
    this.setState({ place: defaultValue, directionText: defaultDirection });
  }

  componentWillReceiveProps({ defaultValue, defaultDirection }) {
    this.setState({ place: defaultValue, directionText: defaultDirection });
  }

  onPress = ({ place, source, direction }) => {
    this.setState({ place, directionText: direction, direction, showModal: false }, () => {
      this.props.onChangeText({ place, source, direction });
    });
  }

  getCountryName = (code) => {
    const country = _find(Countries, { code });
    return country.name ? country.name : code;
  }

  getPlaceName = () => {
    const { place, directionText } = this.state;
    const { placeholder } = this.props;

    if (directionText) {
      return (
        <View>
          <Text>{directionText.charAt(0).toUpperCase() + directionText.slice(1)}</Text>
        </View>
      );
    }

    if (place.name) {
      return (
        <View>
          <AppText>{place.name}</AppText>
          <AppText color={Colors.text.gray}>
            {this.getCountryName(place.countryCode)}
          </AppText>
        </View>
      );
    }

    return (<AppText color={Colors.text.gray}>{placeholder}</AppText>);
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
          directionText={this.state.directionText}
          currentLocation={currentLocation}
        />
        <View style={styles.closeWrapper}>
          <TouchableHighlight
            style={styles.close}
            onPress={() => this.setState({ showModal: false })}
          >
            <AppText color={Colors.text.blue} fontVariation="bold" centered>{trans('global.cancel')}</AppText>
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
  defaultDirection: PropTypes.string,
  currentLocation: PropTypes.bool,
};

PlacesInput.defaultProps = {
  defaultValue: { name: '', countryCode: '', coordinates: [] },
  height: 60,
  label: '',
  inputStyle: {},
  direction: false,
  currentLocation: false,
  defaultDirection: null,
  wrapperStyle: {},
};

export default PlacesInput;
