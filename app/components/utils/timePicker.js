import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import PropTypes from 'prop-types';

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
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }} onPress={this.showDateTimePicker}>
          <Text>{this.props.defaultTime}</Text>
        </TouchableOpacity>
        <DateTimePicker
          mode="time"
          is24Hour
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
