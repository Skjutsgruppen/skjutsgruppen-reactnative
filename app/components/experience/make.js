import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

import Icon from '@assets/icons/ic_make_experience.png';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginVertical: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    marginRight: 16,
  },
  title: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
});

const MakeExperience = ({ handlePress }) => (
  <TouchableOpacity onPress={handlePress} style={styles.wrapper}>
    <View style={styles.iconWrapper}>
      <Image source={Icon} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Make an experience!</Text>
      <Text>Click here to take a photo of you and other participants.</Text>
    </View>
  </TouchableOpacity>
);

MakeExperience.propTypes = {
  handlePress: PropTypes.func.isRequired,
};

export default MakeExperience;
