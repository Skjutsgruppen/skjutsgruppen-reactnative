import React, { PureComponent } from 'react';
import { StyleSheet, Image, View, Animated, Platform } from 'react-native';
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
    height: 62,
    width: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    height: 60,
    width: 60,
    borderRadius: 30,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(162, 123, 168, 1)',
      },
      android: {
        backgroundColor: 'rgba(162, 123, 168, 0.25)',
        borderColor: 'rgba(162, 123, 168, 0.75)',
        borderWidth: StyleSheet.hairlineWidth,
      },
    }),
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
  state = { bgRender: 1, profileRender: 2, animValue: new Animated.Value(0) }

  componentDidMount() {
    const { animValue } = this.state;
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      {
        useNativeDriver: true,
      },
    ).start();
  }

  render() {
    const { onPress, coordinate, image, children, count, current, tripType } = this.props;
    const { animValue } = this.state;

    const opacity = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const scale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 1],
    });

    const animatedStyle = Platform.OS === 'ios' ?
      {
        transform: [
          { scale },
        ],
        opacity,
      }
      : {};
    if (current) {
      return (
        <MapView.Marker
          onPress={onPress}
          coordinate={coordinate}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <View style={styles.currentMarker}>
            <Animated.View
              style={[
                styles.glow,
                animatedStyle,
              ]}
            />
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
            style={[styles.profilePic]}
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
