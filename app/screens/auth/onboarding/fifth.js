import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { ColoredText } from '@components/auth/texts';
import { CustomButton } from '@components/common';
import BackButton from '@components/auth/backButton';
import Colors from '@theme/colors';

import GardenIcon from '@assets/icons/icon_garden.png';

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  garden: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 50,
  },
  link: {
    color: Colors.text.black,
    textDecorationLine: 'underline',
  },
  checkbox: {
    height: 50,
    width: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.gray,
    borderRadius: 8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    marginHorizontal: 24,
  },
  button: {
    marginTop: 24,
  },
});

class Fifth extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { isAgreed: false };
  }

  toggleAgreement = () => this.setState({ isAgreed: !this.state.isAgreed });

  render() {
    const { navigation } = this.props;
    const { isAgreed } = this.state;

    return (
      <ScrollView>
        <View style={styles.wrapper}>
          <Image source={GardenIcon} style={styles.garden} />
          <ColoredText
            color={Colors.text.purple}
            style={{ width: '100%', fontSize: 20, lineHeight: 36, marginBottom: '10%' }}
          >
            Does it sound good?
          </ColoredText>
          <ColoredText
            color={Colors.text.green}
            style={{ width: '100%', fontSize: 20, lineHeight: 36 }}
          >
            Here is the rest of our participatory agrrement:
            <Text style={styles.link}> participatory agreement</Text>
          </ColoredText>
          <ColoredText
            color={Colors.text.blue}
            style={{ width: '100%', fontSize: 20, lineHeight: 36 }}
          >
            {'If you agree then you check the box below and press "I agree".'}
          </ColoredText>
          <TouchableWithoutFeedback onPress={this.toggleAgreement}>
            <View style={styles.checkbox}>
              {isAgreed && <Image source={require('@assets/icons/icon_check.png')} />}
            </View>
          </TouchableWithoutFeedback>
          <CustomButton
            style={styles.button}
            bgColor={Colors.background.green}
            onPress={() => navigation.navigate('RegisterMethod')}
            disabled={!isAgreed}
          >
            I agree
          </CustomButton>
          <BackButton onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    );
  }
}

Fifth.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};

export default Fifth;
