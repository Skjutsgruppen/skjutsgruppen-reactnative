import React, { PureComponent } from 'react';
import { StyleSheet, Image, View, Animated, Easing } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { FEED_TYPE_OFFER, FEED_TYPE_WANTED } from '@config/constant';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  dot: {
    alignSelf: 'center',
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: Colors.background.black,
    shadowOpacity: 1,
  },
  markerBg: {
    width: 68,
    height: 68,
    resizeMode: 'cover',
    borderRadius: 20,
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: Colors.background.black,
    shadowOpacity: 0.75,
  },
  profilePic: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    position: 'absolute',
    top: 11,
    left: 14,
  },
  seatCountWrapper: {
    height: 20,
    width: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 3,
    right: 3,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
  },
  pinkBg: {
    backgroundColor: Colors.background.pink,
  },
  seatCount: {
    backgroundColor: 'transparent',
    color: Colors.background.fullWhite,
    fontSize: 10,
  },
  currentMarkerWrapper: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentMarker: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(162, 123, 168, 0.25)',
  },
  currentMarkerInner: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.background.purple,
    borderWidth: 3,
    borderColor: Colors.background.fullWhite,
  },
});

class Marker extends PureComponent {
  state = { bgRender: 1, profileRender: 2, pulseAnim: new Animated.Value(1) }

  componentDidMount() {
    const pulseAnimation = Animated.sequence([
      Animated.timing(this.state.pulseAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.bezier(0.45, 0.01, 0.49, 0.98),
      }),
      Animated.timing(this.state.pulseAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.45, 0.01, 0.49, 0.98),
      }),
    ]);
    Animated.loop(
      pulseAnimation,
    ).start();
  }

  render() {
    const { onPress, coordinate, image, children, count, current, tripType } = this.props;

    const tranformStyle = {
      transform: [{
        scale: this.state.pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1],
        }),
      }],
    };

    if (current) {
      return (
        <MapView.Marker
          onPress={onPress}
          coordinate={coordinate}
          centerOffset={{ x: 0, y: -34 }}
        >
          <View style={styles.currentMarkerWrapper}>
            <Animated.View style={[styles.currentMarker, tranformStyle]} />
            <View style={styles.currentMarkerInner} />
          </View>
        </MapView.Marker>
      );
    }

    return (
      <MapView.Marker
        onPress={onPress}
        coordinate={coordinate}
        centerOffset={{ x: 0, y: -34 }}
      >
        <View style={{ height: 68, width: 68 }}>
          <Image
            style={styles.markerBg}
            source={require('@assets/icons/icon_map_bg.png')}
            onLayout={() => this.setState({ bgRender: 3 })}
            key={`${this.state.bgRender}`}
          />
          <Image
            style={styles.profilePic}
            source={{ uri: image }}
            onLayout={() => this.setState({ initialRender: 4 })}
            key={`${this.state.profileRender}`}
          />
        </View>
        <View style={styles.dot} />
        <View style={[
          styles.seatCountWrapper,
          tripType === FEED_TYPE_OFFER ? styles.pinkBg : {},
          tripType === FEED_TYPE_WANTED ? styles.blueBg : {},
        ]}
        >
          {!!count && <AppText size={10} color={Colors.text.white}>{count > 0 ? count : ''}</AppText>}
        </View>
        {children}
      </MapView.Marker>
    );
  }
}

Marker.propTypes = {
  onPress: PropTypes.func.isRequired,
  coordinate: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  image: PropTypes.string,
  children: PropTypes.node,
  count: PropTypes.number,
  current: PropTypes.bool,
  tripType: PropTypes.string,
};

Marker.defaultProps = {
  children: null,
  current: false,
  tripType: null,
  count: null,
  image: '',
};

export default Marker;
