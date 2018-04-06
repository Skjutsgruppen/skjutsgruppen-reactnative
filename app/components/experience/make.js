import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

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
});

const MakeExperience = ({ handlePress }) => (
  <TouchableOpacity onPress={handlePress} style={styles.wrapper}>
    <View style={styles.iconWrapper}>
      <Image source={Icon} />
    </View>
    <View style={{ flex: 1 }}>
      <AppText fontVariation="bold" color={Colors.text.blue}>Make an experience!</AppText>
      <AppText>Click here to take a photo of you and other participants.</AppText>
    </View>
  </TouchableOpacity>
);

MakeExperience.propTypes = {
  handlePress: PropTypes.func.isRequired,
};

export default MakeExperience;
