import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import Button from '@components/experience/button';
import { Loading } from '@components/common';
import CapturedImage from '@components/experience/capturedImage';
import PropTypes from 'prop-types';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  msgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  },
  msg: {
    lineHeight: 30,
    maxWidth: 220,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
});

const Preview = ({ error, loading, image, onNext, reTry }) => {
  let button = (
    <Button onPress={onNext} label="Okay" />
  );

  if (loading) {
    button = (<Loading />);
  }

  if (error) {
    button = (
      <View>
        <AppText>{error}</AppText>
        <Button onPress={reTry} label="Retry" />
      </View>
    );
  }

  return (
    <ScrollView>
      <CapturedImage imageURI={image} />
      <View style={styles.msgWrapper}>
        <AppText centered style={styles.msg} > All done!</AppText>
        <AppText centered style={styles.msg} >
          When all tagged participants confirm the experience it will be published.
        </AppText>
      </View>
      <View style={styles.actions}>
        {button}
      </View>
    </ScrollView>
  );
};

Preview.propTypes = {
  error: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  reTry: PropTypes.func.isRequired,
};

export default Preview;
