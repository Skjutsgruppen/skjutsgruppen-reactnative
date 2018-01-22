/* global fetch, navigator */
import React, { PureComponent } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PropTypes from 'prop-types';
import { getGooglePlaceByLatlng, GOOGLE_MAP_API_KEY } from '@config';
import { Loading } from '@components/common';

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
});

class GooglePlacesInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      listViewDisplayed: 'auto',
      value: {
        name: '',
        countryCode: '',
        coordinates: [],
      },
      defaultValue: '',
      currentLocationLoading: false,
      currentLocation: {},
    });
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({ value: defaultValue, defaultValue: defaultValue.name });
  }

  componentWillReceiveProps({ defaultValue }) {
    this.setState({ value: defaultValue, defaultValue: defaultValue.name });
  }

  onFocus = () => {
    this.setState({ listViewDisplayed: 'auto' });
  }

  onBlur = () => {
    this.setState({ listViewDisplayed: false }, () => {
      if (this.state.value.coordinates.length === 0) {
        this.setState({ defaultValue: '' });
      }
    });
  }

  onPress = (data, details) => {
    const value = {
      name: details.name,
      countryCode: details.address_components.filter(row => (row.types.indexOf('country') > -1))[0].short_name,
      coordinates: [details.geometry.location.lng, details.geometry.location.lat],
    };

    this.setState({ value, defaultValue: value.name }, () => {
      this.props.onChangeText(value);
    });
  }

  onChangeText = (text) => {
    this.setState({ value: { name: text, countryCode: '', coordinates: [] }, defaultValue: text }, () => {
      this.props.onChangeText(this.state.value);
    });
  }

  currentLocationIcon = () => {
    if (this.state.currentLocationLoading) {
      return (<Loading style={styles.loader} />);
    }

    if (this.props.currentLocation) {
      return (<TouchableOpacity onPress={this.currentLocation} style={styles.inputIconWrapper}>
        <Image source={require('@assets/icons/icon_location.png')} style={styles.inputIcon} />
      </TouchableOpacity>);
    }

    return null;
  }

  currentLocation = () => {
    this.setState({ currentLocationLoading: true });
    const { currentLocation } = this.state;

    if (typeof currentLocation.name !== 'undefined') {
      this.setState({
        value: currentLocation,
        defaultValue: currentLocation.name,
        currentLocationLoading: false,
      }, () => this.props.onChangeText(currentLocation),
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetch(getGooglePlaceByLatlng(position.coords.latitude, position.coords.longitude))
          .then(response => response.json())
          .then((responseJson) => {
            const value = {
              name: responseJson.results[0].address_components[0].long_name,
              countryCode: responseJson.results[0].address_components.filter(row => (row.types.indexOf('country') > -1))[0].short_name,
              coordinates: [position.coords.longitude, position.coords.latitude],
            };

            this.setState({
              value,
              currentLocation: value,
              defaultValue: value.name,
              currentLocationLoading: false,
            }, () => this.props.onChangeText(value),
            );
          })
          .catch((error) => {
            console.warn(error);
            this.setState({ currentLocationLoading: false });
          });
      },
      (error) => {
        Alert.alert(error.message);
        this.setState({ currentLocationLoading: false });
      },
      { timeout: 20000, maximumAge: 1000 },
    );
  };

  render() {
    const { placeholder } = this.props;
    const { listViewDisplayed, defaultValue } = this.state;

    return (
      <View style={[styles.inputWrapper]}>
        <GooglePlacesAutocomplete
          placeholder={placeholder}
          textInputProps={{
            autoCorrect: false,
            onFocus: this.onFocus,
            onChangeText: this.onChangeText,
            onBlur: this.onBlur,
            value: defaultValue,
          }}
          closeOnEndEditing
          minLength={2}
          autoFocus={false}
          keyboardShouldPersistTaps="always"
          returnKeyType={'search'}
          listViewDisplayed={listViewDisplayed}
          fetchDetails
          renderDescription={row => row.description}
          onPress={this.onPress}
          enablePoweredByContainer={false}
          query={{
            key: GOOGLE_MAP_API_KEY,
            language: 'en',
            types: '',
          }}
          styles={{
            textInputContainer: {
              width: '100%',
              height: 48,
              backgroundColor: '#fff',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingHorizontal: 14,
            },
            listView: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderColor: '#bbb',
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0,
              height: 48,
              color: '#000',
              fontSize: 14,
            },
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          GoogleReverseGeocodingQuery={{
          }}
          GooglePlacesSearchQuery={{
            rankby: 'distance',
            types: 'food',
          }}
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
          predefinedPlaces={[]}
          debounce={200}
        />
        {this.currentLocationIcon()}
        {this.props.children}
      </View>
    );
  }
}

GooglePlacesInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  currentLocation: PropTypes.bool,
  defaultValue: PropTypes.shape(({
    name: PropTypes.string,
    countryCode: PropTypes.string,
    coordinates: PropTypes.array,
  })).isRequired,
  children: PropTypes.node,
};

GooglePlacesInput.defaultProps = {
  currentLocation: false,
  defaultValue: { name: '', countryCode: '', coordinates: [] },
  children: null,
};

export default GooglePlacesInput;
