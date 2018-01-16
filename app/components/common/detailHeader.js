import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    height: 224,
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: '100%',
    height: 224,
  },
  paginationStyle: {
    height: 18,
    width: 48,
    bottom: 16,
    marginLeft: 16,
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});

class DetailHeader extends PureComponent {
  renderSlides = () => {
    const { trip, handleMapPress } = this.props;

    if (trip.photo) {
      return [
        <View style={styles.wrapper} key="photo">
          <Image source={{ uri: trip.photo }} style={styles.image} />
        </View>,
        <TouchableOpacity onPress={handleMapPress} key="map">
          <View style={styles.wrapper}>
            <Image source={{ uri: trip.mapPhoto }} style={styles.image} />
          </View>
        </TouchableOpacity>,
      ];
    }

    return (
      <TouchableOpacity onPress={handleMapPress}>
        <View style={styles.wrapper}>
          <Image source={{ uri: trip.mapPhoto }} style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <Swiper
        showsButtons={false}
        style={styles.wrapper}
        autoplay
        loop={false}
        paginationStyle={styles.paginationStyle}
        dotColor="#aaa"
        activeDotColor="#fff"
        autoplayTimeout={5}
      >
        {this.renderSlides()}
      </Swiper>
    );
  }
}

DetailHeader.propTypes = {
  trip: PropTypes.shape({
    photo: PropTypes.string,
    mapPhoto: PropTypes.string,
  }).isRequired,
  handleMapPress: PropTypes.func,
};

DetailHeader.defaultProps = {
  handleMapPress: () => {},
};

export default DetailHeader;
