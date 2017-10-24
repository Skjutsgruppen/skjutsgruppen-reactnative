import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import GooglePlace from '@components/googlePlace';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';

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
    marginTop: 12,
    marginHorizontal: 24,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.background.fullWhite,
    paddingRight: 24,
  },
  inputIconWrapper: {
    height: 48,
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  infoText: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    margin: 24,
  },
  place: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 12,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
  },
  radioWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    height: 40,
    width: 40,
    borderRadius: 24,
    borderWidth: 8,
    borderColor: '#ffffff',
  },
  radioLabel: {
    fontWeight: 'bold',
    color: '#777777',
    marginTop: 4,
  },
  destinations: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  option: {
    paddingHorizontal: 10,
    fontSize: 11,
    lineHeight: 20,
    fontWeight: 'bold',
    backgroundColor: Colors.background.darkCyan,
    color: Colors.text.white,
  },
  verticalDivider: {
    borderBottomColor: Colors.border.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 24,
  },
  returnIcon: {
    width: 60,
    height: 48,
    resizeMode: 'contain',
    marginHorizontal: 24,
    alignSelf: 'center',
  },
});

class Trip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: {},
      end: {},
      isReturning: false,
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    const state = this.state;
    onNext(state);
  };

  handleReturnChange = (isReturning) => {
    this.setState({ isReturning });
  };

  render() {
    return (
      <View>
        <Text style={styles.title}>Trip</Text>
        <Text style={styles.label}>From</Text>
        <View style={styles.inputWrapper}>
          <GooglePlace
            placeholder="Start here"
            onChangeText={
              start => this.setState({
                start: {
                  name: start.name,
                  countryCode: start.countryCode,
                  coordinates: [start.lat, start.lng],
                },
              })
            }
            style={{ marginBottom: 32 }}
          />
          <TouchableOpacity style={styles.inputIconWrapper}>
            <Image source={require('@icons/icon_location.png')} style={styles.inputIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>To</Text>
        <View style={styles.inputWrapper}>
          <GooglePlace
            placeholder="Destination"
            onChangeText={
              end => this.setState({
                end: {
                  name: end.name,
                  countryCode: end.countryCode,
                  coordinates: [end.lat, end.lng],
                },
              })
            }
          />
          <TouchableOpacity style={styles.inputIconWrapper}>
            <Image source={require('@icons/icon_switcher.png')} style={styles.inputIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.destinations}>
          <TouchableOpacity>
            <Text style={styles.option}>Anywhere</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>South</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>North</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>West</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.option}>East</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalDivider} />
        <Image source={require('@icons/icon_return.png')} style={styles.returnIcon} />
        <Text style={styles.title}>Are you making a return ride?</Text>
        <Text style={styles.infoText}>
          If select <Text style={styles.bold}>yes</Text> you will get
          to do a new card for your return ride after you are done filling
          in this card. The cards will be connected to each other.
        </Text>
        <View style={styles.radioRow}>
          <View style={styles.radioWrapper}>
            <TouchableWithoutFeedback
              onPress={() => this.handleReturnChange(true)}
            >
              <View style={[styles.radio, { backgroundColor: this.state.isReturning ? '#1db0ed' : '#ffffff' }]} />
            </TouchableWithoutFeedback>
            <Text style={styles.radioLabel}>Yes!</Text>
          </View>
          <View style={styles.radioWrapper}>
            <TouchableWithoutFeedback
              onPress={() => this.handleReturnChange(false)}
            >
              <View style={[styles.radio, { backgroundColor: this.state.isReturning ? '#ffffff' : '#1db0ed' }]} />
            </TouchableWithoutFeedback>
            <Text style={styles.radioLabel}>Not this time</Text>
          </View>
        </View>
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.button}
        >
          Next
        </CustomButton>
      </View>
    );
  }
}

Trip.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Trip;
