import React from 'react';
import { StyleSheet, ViewPropTypes, TouchableHighlight, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { FEEDABLE_EXPERIENCE } from '@config/constant';

const cardHeight = Dimensions.get('window').height * 0.6;

const styles = StyleSheet.create({
  experience: {
    height: cardHeight,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.15,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
});

const Experience = ({ experience, onPress, wrapperStyle }) => {
  let image = null;

  if (experience.photoUrl) {
    image = (<Image source={{ uri: experience.photoUrl }} style={styles.img} />);
  }

  return (
    <TouchableHighlight
      key={experience.id}
      onPress={() => onPress(FEEDABLE_EXPERIENCE, experience)}
      style={[styles.experience, wrapperStyle]}
      underlayColor={Colors.background.lightGray}
    >
      {image}
    </TouchableHighlight>
  );
};

Experience.propTypes = {
  experience: PropTypes.shape({
    id: PropTypes.number,
    body: PropTypes.string,
  }).isRequired,
  wrapperStyle: ViewPropTypes.style,
  onPress: PropTypes.func.isRequired,
};

Experience.defaultProps = {
  wrapperStyle: {},
};

export default Experience;
