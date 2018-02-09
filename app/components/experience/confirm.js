import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import Button from '@components/experience/button';
import { Loading } from '@components/common';
import CapturedImage from '@components/experience/capturedImage';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  msgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  },
  msg: {
    fontSize: 16,
    lineHeight: 30,
    color: '#000',
    textAlign: 'center',
    maxWidth: 220,
  },
  actions: {
    alignItems: 'center',
    justifyContent: 'center',
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
        <Text>{error}</Text>
        <Button onPress={reTry} label="Retry" />
      </View>
    );
  }

  return (
    <ScrollView>
      <CapturedImage imageURI={image} />
      <View style={styles.msgWrapper}>
        <Text style={styles.msg} > All done!</Text>
        <Text style={styles.msg} >
          When all tagged participants confirm the experience it will be published.
        </Text>
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
