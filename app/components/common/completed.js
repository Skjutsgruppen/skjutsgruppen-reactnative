import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';

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
    fontSize: 13,
    color: Colors.text.darkGray,
    textAlign: 'center',
    marginBottom: 24,
  },
  blueText: {
    color: Colors.text.blue,
  },
  textUnderlined: {
    textDecorationLine: 'underline',
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
});

const Completed = ({ url, text, isCliped, onButtonPress, isReturnedTrip, onMakeReturnRide }) => (
  <View style={styles.wrapper}>
    <Text style={styles.title}>Your {text} is published.</Text>
    <Image source={require('@assets/celebration.png')} style={styles.image} />
    <Text style={[styles.text, styles.bold]}>Its now searchable, well done.!</Text>
    <Text style={styles.text}>This is the unique address to your {text}:</Text>
    <Text selectable style={styles.uniqueAddress}>{url}</Text>
    {isCliped && <Text style={[styles.text, styles.italic]}>
      (Its copied to your clipboard so you can paste it wherever you want)
    </Text>}
    <View style={styles.buttonWrapper}>

      {
        isReturnedTrip ?
          (<View>
            <Text style={[styles.text, styles.blueText, styles.bold]}>
              You have choosen to make an return ride connected to this ride.
            </Text>
            <CustomButton onPress={onMakeReturnRide} bgColor={Colors.background.darkCyan}>
              Make return ride
            </CustomButton>
            <TouchableOpacity onPress={onButtonPress}>
              <Text style={[styles.text, styles.textUnderlined]}>
                I do not want to make a return ride
              </Text>
            </TouchableOpacity>
          </View>)
          :
          (
            <CustomButton onPress={onButtonPress} bgColor={Colors.background.darkCyan}>
              {`See your ${text}`}
            </CustomButton>
          )
      }
    </View>
  </View>
);

Completed.propTypes = {
  onButtonPress: PropTypes.func.isRequired,
  isCliped: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isReturnedTrip: PropTypes.bool,
  onMakeReturnRide: PropTypes.func,
};

Completed.defaultProps = {
  isReturnedTrip: false,
  onMakeReturnRide: () => { },
};

export default Completed;
