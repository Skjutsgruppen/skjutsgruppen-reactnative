import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import Gradients from '@theme/gradients';

const cardHeight = 420;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: cardHeight / 2,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.75,
  },
  gradient: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

const GroupMap = ({ group, onMapPress, showOverlay }) => (
  <TouchableOpacity onPress={onMapPress} style={styles.wrapper}>
    <Image
      source={{ uri: group.mapPhoto }}
      style={styles.img}
    />
    {
      showOverlay &&
      <LinearGradient
        start={{ x: 0.0, y: 0.5 }}
        end={{ x: 1.0, y: 0.5 }}
        colors={Gradients.transparentPink}
        style={styles.gradient}
      >
        <Text style={styles.groupName}>{group.name}</Text>
      </LinearGradient>
    }
  </TouchableOpacity>
);

GroupMap.propTypes = {
  group: PropTypes.shape({
    mapPhoto: PropTypes.string,
  }).isRequired,
  onMapPress: PropTypes.func.isRequired,
  showOverlay: PropTypes.bool,
};

GroupMap.defaultProps = {
  showOverlay: false,
};

export default GroupMap;
