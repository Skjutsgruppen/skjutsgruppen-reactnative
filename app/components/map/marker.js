import React, { PureComponent } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Image, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  dot: {
    alignSelf: 'center',
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 1,
    elevation: 0.5,
  },
  markerBg: {
    width: 68,
    height: 68,
    resizeMode: 'cover',
    borderRadius: 20,
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
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
    backgroundColor: Colors.background.blue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 3,
    right: 3,
  },
  seatCount: {
    backgroundColor: 'transparent',
    color: Colors.background.fullWhite,
    fontSize: 10,
  },
});

class Marker extends PureComponent {
  state = { bgRender: 1, profileRender: 2 }

  render() {
    const { onPress, coordinate, image, children, count } = this.props;
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
        {
          count > 0 &&
          <View style={styles.seatCountWrapper}>
            <Text style={styles.seatCount}>{count}</Text>
          </View>
        }
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
  image: PropTypes.string.isRequired,
  children: PropTypes.node,
  count: PropTypes.number.isRequired,
};

Marker.defaultProps = {
  children: null,
};

export default Marker;
