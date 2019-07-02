import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';
import Colors from '@theme/colors';
import { getTimezone } from '@helpers/device';

const styles = StyleSheet.create({
  input: {
    height: 80,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
    justifyContent: 'center',
    marginBottom: 32,
    paddingLeft: 20,
  },
});

class TimePicker extends Component {
  state = {
    isDateTimePickerVisible: false,
  };

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    this.hideDateTimePicker();
    this.props.onChange(moment(date).format('HH:mm'));
  };

  render() {
    return (
      <View>
        <TouchableHighlight style={styles.input} onPress={this.showDateTimePicker}>
          <AppText>{this.props.defaultTime}</AppText>
        </TouchableHighlight>
        <DateTimePicker
          mode="time"
          is24Hour
          // onDateChange={date => console.log(date)}
          datePickerModeAndroid="spinner"
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </View>
    );
  }
}

TimePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultTime: PropTypes.string.isRequired,
};

export default TimePicker;
