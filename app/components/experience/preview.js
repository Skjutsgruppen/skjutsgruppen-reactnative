import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import CapturedImage from '@components/experience/capturedImage';
import CameraHead from '@icons/ic_camera_head.png';
import Button from '@components/experience/button';

const styles = StyleSheet.create({
  cameraHead: {
    alignSelf: 'center',
    marginTop: 30,
  },
  msg: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: '6%',
    paddingHorizontal: 24,
  },
});

const Preview = ({ image, onBack, onNext }) => (
  <ScrollView>
    <Image source={CameraHead} style={styles.cameraHead} />
    <CapturedImage imageURI={image} />
    <Text style={styles.msg}>Nice! Well done!</Text>
    <View style={styles.actions}>
      <Button onPress={onBack} label="Back" icon="back" />
      <Button onPress={onNext} label="Done" icon="next" />
    </View>
  </ScrollView>
);

Preview.propTypes = {
  image: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Preview;
