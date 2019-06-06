/* global fetch, XMLHttpRequest */
import React, { Component } from 'react';
import { getPlaceByLatlngURL, getPlaceSuggestURL, getPlaceDetailURL } from '@helpers/location';
import { getCurrentLocation } from '@helpers/device';
import PropTypes from 'prop-types';
import {
  TextInput,
  View,
  FlatList,
  Image,
  StyleSheet,
  PixelRatio,
  Platform,
} from 'react-native';
import { Wrapper } from '@components/common';
import { FiltersWrapper, Filter } from '@components/search/filter';
import { Colors } from '@theme';
import LocationIcon from '@assets/icons/ic_location.png';
import debounce from 'lodash/debounce';
import { Loading } from '@components/common/index';
import Place from '@components/search/place/place';
import ConfirmModal from '@components/common/confirmModal';
import GeoLocation from '@services/location/geoLocation';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';
import TouchableHighlight from '@components/touchableHighlight';
import CrossIcon from '@assets/icons/ic_cross.png';
import I18n from 'react-native-i18n';

const defaultStyles = {
  container: {
    flex: 1,
  },
  textInputContainer: {
    backgroundColor: '#C9C9CE',
    borderTopColor: '#7e7e7e',
    borderBottomColor: '#b5b5b5',
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 60,
    fontFamily: 'SFUIText-Regular',
    fontSize: 15,
    flex: 1,
  },
  poweredContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  listView: {
    backgroundColor: Colors.background.mutedBlue,
  },
  row: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#c8c7cc',
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
  lightText: {
    color: Colors.text.gray,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.background.fullWhite,
    paddingVertical: '2%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
  },
  input: {
    paddingVertical: 10,
    flex: 1,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationIcon: {
    marginRight: 20,
  },
  closeIconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginLeft: 12,
  },
  closeIcon: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

class GooglePlacesAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTurnOnGpsModal: false,
      text: '',
      dataSource: [],
      loading: false,
      currentLocation: {},
      currentLocationLoading: false,
      selectedItem: '',
      direction: null,
    };
    this.isComponentMounted = true;
    this.results = [];
    this.requests = [];
  }

  componentWillMount() {
    this.requestPlace = debounce(this.requestPlace, 2000);
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.abortRequests();
    this.isComponentMounted = false;
  }

  onChangeText = (text) => {
    let loading = false;
    if (text.length >= this.props.minLength) {
      loading = true;
      this.requestPlace(text);
    }
    this.setState({ text, loading });
  }

  getCurrentLocation = async () => {
    try {
      const isGpsEnabled = await GeoLocation.isGpsEnabled();

      if (!isGpsEnabled) {
        this.setState({ showTurnOnGpsModal: true, fetchingPosition: false });

        return;
      }

      if (this.state.currentLocationLoading) {
        return;
      }

      this.setState({ currentLocationLoading: true });

      const { latitude, longitude } = await getCurrentLocation();
      let response = await fetch(getPlaceByLatlngURL(latitude, longitude));
      response = await response.json();
      this.props.onPress({
        place: {
          name: response.results[0].formatted_address.split(',')[0],
          countryCode: response.results[0].address_components.filter(row => (row.types.indexOf('country') > -1))[0].short_name,
          coordinates: [longitude, latitude],
        },
        source: 'currentLocation',
      });
    } catch (error) {
      console.warn(error);
      this.setState({ currentLocationLoading: false });
    }
  }

  requestPlaceDetail = (item) => {
    this.sendHttpRequest({
      url: getPlaceDetailURL(item.place_id),
      onSuccess: (response) => {
        if (response.status === 'OK' && this.isComponentMounted === true) {
          const details = response.result;
          this.props.onPress({
            place: {
              name: details.formatted_address.split(',')[0],
              countryCode: details.address_components.filter(row => (row.types.indexOf('country') > -1))[0].short_name,
              coordinates: [details.geometry.location.lng, details.geometry.location.lat],
            },
            source: 'googlePlaceAPI',
          });
        }
      },
      onError: (e) => {
        console.warn(e);
        this.setState({ loading: false });
      },
    });
  }

  abortRequests = () => {
    this.requests.map(i => i.abort());
    this.requests = [];
  }

  sendHttpRequest = ({ url, onSuccess, onError }) => {
    const request = new XMLHttpRequest();
    this.requests.push(request);
    request.timeout = 20000;
    request.onTimeout = () => console.warn('google places autocomplete: request timeout');
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 200) {
        const responseJSON = JSON.parse(request.responseText);
        if (typeof responseJSON.error_message !== 'undefined') {
          onError(responseJSON.error_message);
        } else {
          onSuccess(responseJSON);
        }
      } else {
        onError(request.status);
      }
    };
    request.open('GET', url);

    request.send();
  }

  requestPlace = (text) => {
    this.abortRequests();

    this.sendHttpRequest({
      url: getPlaceSuggestURL(text, I18n.locale),
      onSuccess: (response) => {
        if (typeof response.predictions !== 'undefined') {
          if (this.isComponentMounted === true) {
            this.setState({ loading: false, dataSource: response.predictions });
          }
        }
      },
      onError: (e) => {
        console.warn(e);
        this.setState({ loading: false });
      },
    });
  }

  directionSelected = (direction) => {
    this.props.onPress({ place: { name: '', countryCode: '', coordinates: [] }, direction, source: 'direction' });
  }

  openGpsSettings = () => {
    GeoLocation.showSettings();
    this.setState({ showTurnOnGpsModal: false });
  }

  renderTurnOnGpsActionModal = () => (
    <ConfirmModal
      visible={this.state.showTurnOnGpsModal}
      loading={false}
      cancelable={(Platform === 'android' || Platform.OS === 'android')}
      onDeny={() => this.setState({ showTurnOnGpsModal: false })}
      confirmLabel={Platform === 'android' || Platform.OS === 'android' ? trans('global.open_settings') : trans('global.ok')}
      onConfirm={() => this.openGpsSettings()}
      message={trans(Platform === 'android' || Platform.OS === 'android' ? 'global.gps_turned_off_android' : 'global.gps_turned_off_ios')}
      onRequestClose={() => this.setState({ showTurnOnGpsModal: false })}
    />
  )

  renderItem = ({ item }) => (
    <Place
      loading={this.state.selectedItem === item}
      onPress={this.requestPlaceDetail}
      item={item}
    />
  );

  renderSearchResult = () => {
    const { dataSource, loading } = this.state;

    if (dataSource.length < 1 && loading) {
      return (<Loading />);
    }

    const keyGenerator = () => (
      Math.random().toString(36).substr(2, 10)
    );

    return (
      <FlatList
        keyboardShouldPersistTaps="always"
        style={defaultStyles.listView}
        data={dataSource}
        keyExtractor={keyGenerator}
        renderItem={this.renderItem}
      />
    );
  }

  renderTextInput = () => {
    const { text } = this.state;
    const { textInputProps, label, onClose } = this.props;

    return (
      <View style={defaultStyles.inputWrapper}>
        <TextInput
          autoFocus
          style={defaultStyles.textInput}
          value={text}
          clearButtonMode="while-editing"
          underlineColorAndroid="transparent"
          onChangeText={this.onChangeText}
          {...textInputProps}
        />
        <AppText size={13} color={Colors.text.gray} fontVariation="bold">{label}</AppText>
        <View style={defaultStyles.closeIconWrapper}>
          <TouchableHighlight style={defaultStyles.closeIcon} onPress={onClose}>
            <Image source={CrossIcon} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderDirectionOption = () => (
    <FiltersWrapper title={`${trans('search.or_choose')}:`}>
      <Filter label={trans('global.anywhere')} active={this.props.directionText === 'anywhere'} onPress={() => this.directionSelected('anywhere')} />
      <Filter label={trans('global.north')} active={this.props.directionText === 'north'} onPress={() => this.directionSelected('north')} />
      <Filter label={trans('global.south')} active={this.props.directionText === 'south'} onPress={() => this.directionSelected('south')} />
      <Filter label={trans('global.west')} active={this.props.directionText === 'west'} onPress={() => this.directionSelected('west')} />
      <Filter label={trans('global.east')} active={this.props.directionText === 'east'} onPress={() => this.directionSelected('east')} />
    </FiltersWrapper>
  );

  renderCurrentLocationOption = () => {
    const { currentLocationLoading } = this.state;

    return (
      <TouchableHighlight
        onPress={() => this.getCurrentLocation()}
      >
        <View style={defaultStyles.suggestion}>
          <Image source={LocationIcon} style={defaultStyles.locationIcon} />
          <AppText>{trans('search.from_where_i_am_now')}</AppText>
          {currentLocationLoading && <Loading />}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { direction, currentLocation } = this.props;
    return (
      <Wrapper>
        {this.renderTextInput()}
        {direction && this.renderDirectionOption()}
        {currentLocation && this.renderCurrentLocationOption()}
        {this.renderSearchResult()}
        {this.renderTurnOnGpsActionModal()}
      </Wrapper>
    );
  }
}

GooglePlacesAutocomplete.propTypes = {
  direction: PropTypes.bool,
  currentLocation: PropTypes.bool,
  textInputProps: PropTypes.shape({}),
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  minLength: PropTypes.number,
  directionText: PropTypes.string,
};

GooglePlacesAutocomplete.defaultProps = {
  direction: false,
  minLength: 2,
  textInputProps: {},
  currentLocation: false,
  directionText: null,
};

export default GooglePlacesAutocomplete;
