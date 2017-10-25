import React, { PureComponent } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_PLACE_KEY } from '@config';
import PropTypes from 'prop-types';

class GooglePlacesInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({ listViewDisplayed: 'auto', value: {}, defaultValue: '' });
  }

  onFocus = () => {
    this.setState({ listViewDisplayed: 'auto' });
  }

  onBlur = () => {
    this.setState({ listViewDisplayed: false }, () => {
      if (!this.state.value.name) {
        this.setState({ defaultValue: '' });
      }
    });
  }

  onPress = (data, details) => {
    const value = {
      name: details.name,
      countryCode: details.address_components[details.address_components.length - 1].short_name,
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng,
    };

    this.setState({ value, defaultValue: value.name }, () => {
      this.props.onChangeText(value);
    });
  }

  onChangeText = text => this.setState({ defaultValue: text })

  render() {
    const { placeholder } = this.props;
    const { listViewDisplayed, defaultValue } = this.state;

    return (
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
          key: GOOGLE_PLACE_KEY,
          language: 'en',
          types: '',
        }}
        styles={{
          textInputContainer: {
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
            fontSize: 16,
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
    );
  }
}

GooglePlacesInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};

export default GooglePlacesInput;
