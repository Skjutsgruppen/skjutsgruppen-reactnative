import React, { Component } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';

export default class App extends Component {

  state = { date: new Date() }

  render() {
    console.log(this.state.date);
    return (
      <View style={{ margin: 12, backgroundColor: '#fff', borderRadius: 4 }}>
        <DatePicker
          date={this.state.date}
          onDateChange={date => this.setState({ date })}
        />
      </View>
    );
  }
}