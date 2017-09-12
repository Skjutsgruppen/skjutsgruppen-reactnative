import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',

  },
  label: {
    color: '#999999',
    marginBottom: 6,
    marginHorizontal: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginHorizontal: 24,
  },
  stops: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stopsLabel: {
    marginBottom: 8,
    marginTop: 24,
    color: '#777777',
  },
  stopsInfo: {
    marginBottom: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
  },
  bold: {
    fontWeight: 'bold',
  },
});

class Route extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: '',
      end: '',
      countryCode: 'NP',
      stops: '',
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    console.log(this.state);
    onNext(this.state);
  };

  render() {
    return (
      <View>
        <Text style={styles.title}>Specific stretch</Text>
        <View>
          <Text style={styles.label}>From</Text>
          <TextInput
            style={styles.input}
            placeholder="Start here"
            underlineColorAndroid="transparent"
            onChangeText={start => this.setState({ start: { name: start, coordinates: [0.862323, 27.2323] } })}
          />
        </View>

        <View>
          <Text style={styles.label}>To</Text>
          <TextInput
            style={styles.input}
            placeholder="Destination"
            underlineColorAndroid="transparent"
            onChangeText={end => this.setState({ end: { name: end, coordinates: [0.862323, 27.2323] } })}
          />
        </View>
        <View style={styles.stops}>
          <View>
            <Text style={styles.stopsLabel}>Stops along the way:</Text>
          </View>
          <View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Place"
                underlineColorAndroid="transparent"
                onChangeText={stops => this.setState({ stops: { name: stops, coordinates: [0.862323, 27.2323] } })}
              />
            </View>
            <Text style={styles.stopsInfo}>
              You can add as many stops as you want as long as you would like to pick up people there.
            </Text>
          </View>
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

Route.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Route;
