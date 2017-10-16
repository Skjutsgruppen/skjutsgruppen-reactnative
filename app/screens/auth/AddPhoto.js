import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import Colors from '@theme/colors';
import Container from '@components/auth/container';
import { ColoredText, GreetText } from '@components/auth/texts';
import CustomButton from '@components/common/customButton';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  garderIcon: {
    marginBottom: 50,
    resizeMode: 'cover',
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 16,
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: Colors.background.fullWhite,
    marginBottom: 32,
  },
  firstNameInput: {
    marginBottom: 12,
  },
  divider: {
    width: '80%',
    height: 1,
    marginVertical: 32,
    backgroundColor: Colors.background.lightGray,
  },
});

class AddPhoto extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <Image source={require('@icons/icon_garden.png')} style={styles.garderIcon} resizeMethod="resize" />
        <GreetText>How about a photo?</GreetText>
        <ColoredText color={Colors.text.purple}>We love to see each other!</ColoredText>
        <ColoredText color={Colors.text.purple}>A photo of you adds trust</ColoredText>
        <ColoredText color={Colors.text.blue}>If you want you can upload a photo here,
        but you can also proceed without a photo.</ColoredText>
        <CustomButton
          bgColor={Colors.background.green}
          onPress={() => this.props.navigation.navigate('SendText')}
        >
          Next
        </CustomButton>
      </Container>
    );
  }
}

AddPhoto.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default AddPhoto;
