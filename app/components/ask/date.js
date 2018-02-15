import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { GlobalStyles } from '@theme/styles';
import SectionLabel from '@components/add/sectionLabel';
import Radio from '@components/add/radio';
import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import { FLEXIBILITY_UNITS, FLEXIBILITY_TYPES } from '@config/constant';

function pad(n, width = 2, padString = '0') {
  const num = String(n);
  return num.length >= width ? num : new Array((width - num.length) + 1).join(padString) + num;
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingBottom: 50,
  },
  info: {
    marginHorizontal: 20,
    lineHeight: 24,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: '7%',
  },
  recurringRide: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderColor: '#ddd',
  },
  recurringTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginBottom: 6,
  },
  flexibleInput: {
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  input: {
    height: 48,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
    marginHorizontal: 20,
  },
});

class Date extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markedDates: {},
      dates: [],
      isFlexible: false,
      flexibilityInfo: {
        duration: 0,
        unit: 'minute',
        type: 'later',
      },
      time: '00:00',
    };
  }

  componentWillMount() {
    const { defaultTime: time, defaultFlexibilityInfo: flexibilityInfo } = this.props;
    this.setState({ time, flexibilityInfo, isFlexible: flexibilityInfo.duration > 0 });
  }

  onNext = () => {
    const { onNext } = this.props;
    const state = this.state;
    const markedDates = { ...state.markedDates };
    const dates = [];

    Object.keys(markedDates).forEach((day) => {
      dates.push(day);
    });

    state.dates = dates;
    onNext(state);
  };

  onSelectDay = (date) => {
    const { markedDates } = this.state;
    const selectedDate = date.dateString;

    const newDates = { ...markedDates };
    if (markedDates[selectedDate]) {
      delete newDates[selectedDate];
      this.setState({ markedDates: newDates });
    } else {
      newDates[selectedDate] = [
        { startingDay: true, color: '#1ca9e5', textColor: '#fff' },
        { endingDay: true, color: '#1ca9e5', textColor: '#fff' },
      ];
      this.setState({ markedDates: newDates });
    }
  };

  setTime = (input, type) => {
    const { time } = this.state;
    let [h, m] = time.split(':');
    if (type === 'hour') {
      h = input;
    }

    if (type === 'minute') {
      m = input;
    }

    this.setState({ time: `${h}:${m}` });
  };

  setDuration = (duration) => {
    const { flexibilityInfo } = this.state;
    flexibilityInfo.duration = parseInt(duration, 10);
    this.setState({ flexibilityInfo });
  }

  setUnit = (unit) => {
    const { flexibilityInfo } = this.state;
    flexibilityInfo.unit = unit;

    this.setState({ flexibilityInfo });
  }

  setType = (type) => {
    const { flexibilityInfo } = this.state;
    flexibilityInfo.type = type;

    this.setState({ flexibilityInfo });
  }

  handleFlexibilityChange = (flexibility) => {
    this.setState({
      isFlexible: flexibility,
    });
  }

  renderHoursOptions = () => {
    const options = [];
    let i = 0;
    do {
      i += 1;
      options.push(<Picker.Item
        key={`hour-${i}`}
        label={pad(i)}
        value={pad(i)}
      />);
    } while (i < 24);

    return options;
  };

  renderMinutesOptions = (key) => {
    const options = [];
    let i = 0;
    do {
      options.push(<Picker.Item
        key={`${key}-${i}`}
        label={pad(i)}
        value={pad(i)}
      />);
      i += 1;
    } while (i < 60);

    return options;
  };

  renderUnit = () => {
    const units = FLEXIBILITY_UNITS;

    return units.map(option => (
      <Picker.Item
        key={option}
        value={option}
        label={option}
      />
    ));
  };

  renderType = () => {
    const types = FLEXIBILITY_TYPES;

    return types.map(option => (
      <Picker.Item
        key={option}
        value={option}
        label={option}
      />
    ));
  }

  render() {
    const { time, isFlexible, flexibilityInfo } = this.state;
    const [h, m] = time.split(':');

    return (
      <View style={styles.wrapper}>
        <SectionLabel label="Date" color={Colors.text.blue} />
        <View style={{
          backgroundColor: '#fff',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          marginBottom: 20,
          padding: 10,
        }}
        >
          <Calendar
            firstDay={1}
            onDayPress={this.onSelectDay}
            markedDates={this.state.markedDates}
            markingType="interactive"
            minDate={Moment(new Date()).format('YYYY-MM-DD')}
            hideExtraDays
          />
        </View>
        <View style={styles.recurringRide}>
          <SectionLabel label="Recurring ride?" color={Colors.text.blue} />
          <Text style={[GlobalStyles.TextStyles.light, styles.info]}>
            Place more blue balls in the calendar the dates you are doing this trip
            again (click on balls to remove).</Text>
        </View>
        <SectionLabel label="Time" color={Colors.text.blue} />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Picker
              mode="dropdown"
              onValueChange={e => this.setTime(e, 'hour')}
              selectedValue={h}
            >
              <Picker.Item
                label={'Hour'}
                value={'00'}
              />
              {this.renderHoursOptions()}
            </Picker>
          </View>
          <View style={styles.inputWrapper}>
            <Picker
              mode="dropdown"
              onValueChange={e => this.setTime(e, 'minute')}
              selectedValue={m}
            >
              <Picker.Item
                label={'Minute'}
                value={'00'}
              />
              {this.renderMinutesOptions('minute')}
            </Picker>
          </View>
        </View>
        <View style={styles.radioRow}>
          <Radio
            active={!isFlexible}
            label="Exact time"
            onPress={() => this.handleFlexibilityChange(false)}
            color="blue"
          />
          <Radio
            active={isFlexible}
            label="Flexible time"
            onPress={() => this.handleFlexibilityChange(true)}
            color="blue"
          />
        </View>
        {
          isFlexible &&
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text>I can go</Text>
            </View>
            <View style={styles.inputWrapper}>
              <Picker
                mode="dropdown"
                onValueChange={duration => this.setDuration(duration)}
                selectedValue={pad(flexibilityInfo.duration.toString())}
              >
                {this.renderMinutesOptions('flexible')}
              </Picker>
            </View>
            <View style={styles.inputWrapper}>
              <Picker
                mode="dropdown"
                onValueChange={unit => this.setUnit(unit)}
                selectedValue={flexibilityInfo.unit}
              >
                {this.renderUnit()}
              </Picker>
            </View>
            <View style={styles.inputWrapper}>
              <Picker
                mode="dropdown"
                onValueChange={type => this.setType(type)}
                selectedValue={flexibilityInfo.type}
              >
                {this.renderType()}
              </Picker>
            </View>
          </View>
        }
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Next
        </RoundedButton>
      </View>
    );
  }
}

Date.propTypes = {
  onNext: PropTypes.func.isRequired,
  defaultTime: PropTypes.string,
  defaultFlexibilityInfo: PropTypes.shape({
    duration: PropTypes.number,
    type: PropTypes.string,
    unit: PropTypes.string,
  }),
};

Date.defaultProps = {
  defaultTime: '00:00',
  defaultFlexibilityInfo: {
    duration: 0,
    type: 'minute',
    unit: 'later',
  },
};

export default Date;
