import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import AppText from '@components/utils/texts/appText';
import TouchableHighlight from '@components/touchableHighlight';
import { ACTIVITY_TYPE_CREATE_EXPERIENCE } from '@config/constant';
import { trans } from '@lang/i18n';

import ExperienceIcon from '@assets/icons/ic_make_experience.png';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    paddingTop: 6,
  },
  content: {
    paddingLeft: 16,
  },
  title: {
    marginBottom: 8,
  },
});

const MakeExperience = ({ onPress, detail }) => (
  <View style={styles.wrapper}>
    <View style={styles.icon}><Image source={ExperienceIcon} /></View>
    <TouchableHighlight
      onPress={() => onPress(ACTIVITY_TYPE_CREATE_EXPERIENCE, detail)}
      style={{ flex: 1 }}
    >
      <View style={styles.content}>
        <AppText color={Colors.text.blue} style={styles.title}>{trans('experience.make_an_experience')}</AppText>
        <AppText>{trans('experience.click_here_to_take_a_photo')}</AppText>
      </View>
    </TouchableHighlight>
  </View>
);

MakeExperience.propTypes = {
  onPress: PropTypes.func.isRequired,
  detail: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default MakeExperience;
