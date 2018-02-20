import React, { Component } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import { FLEXIBILITY_UNITS, FLEXIBILITY_TYPES } from '@config/constant';

import { GlobalStyles } from '@theme/styles';

import SectionLabel from '@components/add/sectionLabel';
import Radio from '@components/add/radio';

function pad(n, width = 2, padString = '0') {
  const num = String(n);
  return num.length >= width ? num : new Array((width - num.length) + 1).join(padString) + num;
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingBottom: 50,
  },
  section: {
    paddingVertical: 12,
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
      flexible: '00 minutes later',
      flexibilityInfo: {
        duration: 0,
        unit: 'minutes',
        type: 'later',
      },
    };
  }

  componentWillMount() {
    const { defaultTime: time, defaultFlexibilityInfo: flexibilityInfo } = this.props;
    this.setState({ time, flexibilityInfo });
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
      newDates[selectedDate] = { startingDay: true, textColor: 'white', color: Colors.background.pink, endingDay: true };
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
        <SectionLabel label="Date" />
        <Calendar
          firstDay={1}
          onDayPress={this.onSelectDay}
          markedDates={this.state.markedDates}
          markingType={'period'}
          minDate={Moment(new Date()).format('YYYY-MM-DD')}
          hideExtraDays
        />
        <View style={styles.section}>
          <SectionLabel label="Is this a recurring ride?" />
          <Text style={[GlobalStyles.TextStyles.light, styles.info]}>
            Place more balls in the calendar if you are doing this ride again
            (and click on the balls to remove them as well).</Text>
        </View>
        <SectionLabel label="Time" />
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
          <Radio active={!isFlexible} label="Exact time" onPress={() => this.handleFlexibilityChange(false)} />
          <Radio active={isFlexible} label="Flexible time" onPress={() => this.handleFlexibilityChange(true)} />
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
    type: 'minutes',
    unit: 'later',
  },
};

export default Date;
