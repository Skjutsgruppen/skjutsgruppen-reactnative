import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@theme/colors';
import CapturedImage from '@components/experience/capturedImage';
import Button from '@components/experience/button';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  disabledBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.background.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    borderRadius: 8,
    marginBottom: 24,
  },
  experienceTagActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '5%',
    paddingHorizontal: 24,
  },
});
const PendingExperiencePublish = ({ experience, onPress }) => {
  let image = null;

  if (experience.photo) {
    image = (<CapturedImage imageURI={experience.photo} />);
  }

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.flex}>
        {image}
        <View style={styles.infoSection}>
          <View style={styles.disabledBtn}>
            <Text style={styles.acceptedInfo}>You have accepted tag to this experience</Text>
          </View>
          <Text style={styles.infoText}>
            When all the participants confirm to this experience, it will be published.
          </Text>
        </View>
        <View style={styles.experienceTagActions}>
          <Button onPress={onPress} label="Okay" />
        </View>
      </ScrollView>

    </View>);
};

PendingExperiencePublish.propTypes = {
  experience: PropTypes.shape({
    Participants: PropTypes.array,
    Trip: PropTypes.object,
    User: PropTypes.shape({
      id: PropTypes.string,
      firstName: PropTypes.string,
    }),
  }),
  onPress: PropTypes.func.isRequired,
};

PendingExperiencePublish.defaultProps = {
  experience: {},
};

export default PendingExperiencePublish;
