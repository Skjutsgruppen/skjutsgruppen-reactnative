import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginHorizontal: 24,
  },
  countInput: {
    height: 110,
    width: 150,
    fontSize: 60,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
  },
  inputWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
});

class Seats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seat: '1',
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state.seat);
  };

  render() {
    return (
      <View>
        <Text style={styles.title}> Seats</Text>
        <Text style={styles.text}>How many seats do you offer?</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            defaultValue={this.state.seat}
            style={styles.countInput}
            maxLength={2}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            onChangeText={seat => this.setState({ seat })}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            onPress={this.onNext}
            title="Next"
            color="#38ad9e"
            accessibilityLabel="Go to next form"
          />
        </View>
      </View>
    );
  }
}

Seats.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Seats;
