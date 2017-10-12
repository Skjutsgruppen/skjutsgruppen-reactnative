import React from 'react';
import { Text, View, Button, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
  },
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
    alignSelf: 'center',
    marginBottom: 24,
  },
  text: {
    color: '#777777',
    textAlign: 'center',
    marginBottom: 24,

  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  uniqueAddress: {
    fontSize: 16,
    color: '#1ca9e5',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginVertical: 24,
  },
  button: {
    fontWeight: 'bold',
  },
});

const Completed = ({ offer, onButtonPress }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Your ride is published.</Text>
    <Image source={require('@assets/celebration.png')} style={styles.image} />
    <Text style={[styles.text, styles.bold]}>Its now searchable, well done.!</Text>
    <Text style={styles.text}>This is the unique address to your ride:</Text>
    <Text style={styles.uniqueAddress}>{offer.url}</Text>
    <Text style={[styles.text, styles.italic]}>
      (Its copied to your clipboard so you can paste it wherever you want)
    </Text>
    <View style={styles.buttonWrapper}>
      <Button
        onPress={onButtonPress}
        title="See your ride"
        corlor="#38ad9e"
      />
    </View>
  </View>
);

Completed.propTypes = {
  onButtonPress: PropTypes.func.isRequired,
  offer: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default Completed;
