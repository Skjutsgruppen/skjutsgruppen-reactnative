import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginBottom: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 24,
  },
  text: {
    color: '#777777',
    textAlign: 'center',
    marginBottom: 24,
    marginHorizontal: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  uniqueAddress: {
    fontSize: 18,
    color: '#1ca9e5',
    marginBottom: 24,
    marginHorizontal: 24,
    textAlign: 'center',
  },
  button: {
    margin: 24,
  },
});

const Completed = ({ ask, isCliped, onButtonPress }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Your ride is published.</Text>
    <Image source={require('@assets/celebration.png')} style={styles.image} />
    <Text style={[styles.text, styles.bold]}>Its now searchable, well done.!</Text>
    <Text style={styles.text}>This is the unique address to your ride:</Text>
    <Text selectable style={styles.uniqueAddress}>{ask.url}</Text>
    {isCliped && <Text style={[styles.text, styles.italic]}>
      (Its copied to your clipboard so you can paste it wherever you want)
    </Text>}
    <CustomButton
      onPress={onButtonPress}
      bgColor={Colors.background.darkCyan}
      style={styles.button}
    >
      Next
    </CustomButton>
  </View>
);

Completed.propTypes = {
  onButtonPress: PropTypes.func.isRequired,
  isCliped: PropTypes.bool.isRequired,
  ask: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Completed;
