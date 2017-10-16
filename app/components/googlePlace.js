import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_PLACE_KEY } from '@config';
import PropTypes from 'prop-types';

const GooglePlacesInput = ({ placeholder, onChangeText }) => (
  <GooglePlacesAutocomplete
    placeholder={placeholder}
    minLength={2}
    autoFocus={false}
    returnKeyType={'search'}
    listViewDisplayed="auto"
    fetchDetails
    renderDescription={row => row.description}
    onPress={(data, details) => {
      onChangeText({
        name: details.name,
        countryCode: details.address_components[details.address_components.length - 1].short_name,
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      });
    }}
    getDefaultValue={() => ''}
    enablePoweredByContainer={false}
    query={{
      key: GOOGLE_PLACE_KEY,
      language: 'en',
      types: '',
    }}
    styles={{
      textInputContainer: {
        width: '100%',
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
    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
    predefinedPlaces={[]}
    debounce={200}
  />
);

GooglePlacesInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};

export default GooglePlacesInput;
