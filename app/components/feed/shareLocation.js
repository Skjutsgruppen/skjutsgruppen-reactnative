import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import AppText from '@components/utils/texts/appText';
import TouchableHighlight from '@components/touchableHighlight';
import { ACTIVITY_TYPE_SHARE_LOCATION_FEED } from '@config/constant';

import Curve from '@assets/share_location_curve.png';
import LocationIcon from '@assets/icons/ic_location.png';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  curve: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  icon: {
    width: 48,
    height: 100,
    alignItems: 'center',
    paddingTop: 6,
  },
  content: {
    paddingHorizontal: 16,
  },
  mapContainer: {
    padding: 6,
    backgroundColor: Colors.background.mutedBlue,
    borderRadius: 12,
    marginTop: 12,
  },
  map: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 6,
  },
  mapFooter: {
    padding: 12,
  },
});

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ShareLocation = ({ onPress, detail }) => (
  <View style={styles.wrapper}>
    <Image source={Curve} style={styles.curve} />
    <View style={styles.icon}><Image source={LocationIcon} /></View>
    <TouchableHighlight
      onPress={() => onPress(ACTIVITY_TYPE_SHARE_LOCATION_FEED, detail)}
      style={{ flex: 1 }}
    >
      <View style={styles.content}>
        <AppText>{trans('global.your_ride_is_about_to')}</AppText>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              longitude: detail.TripStart.coordinates ?
                detail.TripStart.coordinates[0] : detail.TripEnd.coordinates[0],
              latitude: detail.TripStart.coordinates ?
                detail.TripStart.coordinates[1] : detail.TripEnd.coordinates[1],
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            liteMode
            showsUserLocation
            onPress={() => { }}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
          />
          <AppText color={Colors.text.blue} fontVariation="semibold" style={styles.mapFooter}>{trans('global.share_your_location_for')}</AppText>
        </View>
      </View>
    </TouchableHighlight>
  </View>
);

ShareLocation.propTypes = {
  onPress: PropTypes.func.isRequired,
  detail: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default ShareLocation;
