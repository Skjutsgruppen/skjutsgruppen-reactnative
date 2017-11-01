import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Colors from '@theme/colors';
import CustomButton from '@components/common/customButton';

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
    color: '#777',
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
    margin: 32,
  },
  text: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  optional: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#777',
    fontStyle: 'italic',
  },
});

class Different extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
      county: '',
      municipality: '',
      locality: '',
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    return (
      <View>
        <Text style={styles.title}>Different stretchs</Text>
        <Text style={styles.text}>This groups is based in:</Text>
        <View>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            underlineColorAndroid="transparent"
            onChangeText={country => this.setState({ country })}
          />
        </View>
        <View>
          <Text style={styles.label}>County, <Text style={styles.optional}>optional</Text></Text>
          <TextInput
            style={styles.input}
            placeholder=""
            underlineColorAndroid="transparent"
            onChangeText={county => this.setState({ county })}
          />
        </View>
        <View>
          <Text style={styles.label}>Municipality</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            underlineColorAndroid="transparent"
            onChangeText={municipality => this.setState({ municipality })}
          />
        </View>
        <View>
          <Text style={styles.label}>Locality, <Text style={styles.optional}>optional</Text></Text>
          <TextInput
            style={styles.input}
            placeholder=""
            underlineColorAndroid="transparent"
            onChangeText={locality => this.setState({ locality })}
          />
        </View>
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.buttonWrapper}
        >
          Next
        </CustomButton>
      </View>
    );
  }
}

Different.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Different;
