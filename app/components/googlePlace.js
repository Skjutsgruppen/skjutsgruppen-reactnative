import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_PLACE_KEY } from '@config';

const GooglePlacesInput = ({ placeholder, onChangeText }) => (
  <GooglePlacesAutocomplete
    placeholder={placeholder}
    minLength={2} // minimum length of text to search
    autoFocus={false}
    returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
    listViewDisplayed="auto" // true/false/undefined
    fetchDetails
    renderDescription={row => row.description} // custom description render
    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
      onChangeText({ name: details.name, countryCode: details.address_components[details.address_components.length - 1].short_name, lat: details.geometry.location.lat, lng: details.geometry.location.lng });
    }}
    getDefaultValue={() => ''}
    enablePoweredByContainer={false}
    query={{
      // available options: https://developers.google.com/places/web-service/autocomplete
      key: GOOGLE_PLACE_KEY,
      language: 'en', // language of the results
      types: '', // default: 'geocode'
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

    // currentLocation // Will add a 'Current location' button at the top of the predefined places list
    // currentLocationLabel="Current location"
    nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
    GoogleReverseGeocodingQuery={{
      // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
    }}
    GooglePlacesSearchQuery={{
      // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
      rankby: 'distance',
      types: 'food',
    }}

    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
    predefinedPlaces={[]}

    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
  />
);

export default GooglePlacesInput;
