import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { ColoredText, GreetText } from '@components/auth/texts';
import { CustomButton } from '@components/common';
import PropTypes from 'prop-types';
import { Icons } from '@assets/icons';

const styles = StyleSheet.create({
  garderIcon: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 16,
  },
  button: {
    margin: 24,
  },
});

class AddPhoto extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <Image source={Icons.Garden} style={styles.garderIcon} resizeMethod="resize" />
        <GreetText>How about a photo?</GreetText>
        <ColoredText color={Colors.text.purple}>We love to see each other!</ColoredText>
        <ColoredText color={Colors.text.purple}>A photo of you adds trust</ColoredText>
        <ColoredText color={Colors.text.blue}>If you want you can upload a photo here,
        but you can also proceed without a photo.</ColoredText>
        <CustomButton
          style={styles.button}
          bgColor={Colors.background.green}
          onPress={() => this.props.navigation.replace('SendText')}
        >
          Next
        </CustomButton>
      </Container>
    );
  }
}

AddPhoto.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
};

export default AddPhoto;
