import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Loading } from '@components/common';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    position: 'absolute',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingBottom: 150,
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  actions: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 24,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    padding: 10,
    marginBottom: 24,
    backgroundColor: Colors.background.fullWhite,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  greenButton: {
    width: '100%',
    backgroundColor: Colors.background.green,
  },
  greenButtonText: {
    color: Colors.text.white,
  },
});

const OnBoarding = ({ loading, handleRegister, handleLogin }) => (
  <View style={styles.mainContainer}>
    <Image source={require('@assets/onboarding_bg.jpg')} style={styles.backgroundImage} />
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      alwaysBounceHorizontal={false}
    >
      <View style={styles.screen}>
        <Image source={require('@assets/icons/logo.png')} style={styles.logo} />
      </View>
    </ScrollView>
    {
      !loading ?
        (
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.greenButton]} onPress={handleRegister}>
              <Text style={[styles.buttonText, styles.greenButtonText]}>Become a participant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Already a participant? Log in here</Text>
            </TouchableOpacity>
          </View>
        )
        :
        (
          <View style={styles.actions}>
            <Loading />
          </View>
        )
    }

  </View>
);

OnBoarding.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleRegister: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default OnBoarding;
