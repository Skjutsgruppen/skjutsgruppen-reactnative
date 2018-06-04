import React, { Component } from 'react';
import { StyleSheet, View, Picker, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Moment from 'moment';
import PropTypes from 'prop-types';
import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import { FLEXIBILITY_UNITS, FLEXIBILITY_TYPES } from '@config/constant';
import TimePicker from '@components/utils/timePicker';

import { trans } from '@lang/i18n';
import SectionLabel from '@components/add/sectionLabel';
import Radio from '@components/add/radio';
import { AppText } from '@components/utils/texts';

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
    fontSize: 15,
    color: Colors.text.gray,
    marginHorizontal: 20,
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
  flexibleSection: {
    marginVertical: 16,
  },
  flexibleLabel: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    ...Platform.select({
      android: {
        paddingHorizontal: 12,
      },
    }),
  },
  inputWrapper: {
    width: '33.33%',
    minHeight: 80,
  },
  picker: {
    minHeight: 80,
  },
  input: {
    height: 48,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        paddingHorizontal: 12,
      },
    }),
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
      dateSelected: false,
      markedDates: {},
      days: [],
      time: '00:00',
      isFlexible: false,
      flexibilityInfo: {
        duration: 0,
        unit: 'minutes',
        type: 'later',
      },
    };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    const markedDates = {};
    if (defaultValue.days.length > 0) {
      defaultValue.days.forEach((day) => {
        markedDates[day] = { startingDay: true, textColor: 'white', color: Colors.background.pink, endingDay: true };
      });
    }
    this.setState({ ...defaultValue, ...{ markedDates } });
  }

  onNext = () => {
    const { onNext } = this.props;
    const state = this.state;
    const markedDates = { ...state.markedDates };
    const days = [];

    Object.keys(markedDates).forEach((day) => {
      days.push(day);
    });

    state.days = days;
    onNext(state);
  };

  onSelectDay = (date) => {
    const { markedDates } = this.state;
    const { isOffer } = this.props;
    const selectedDate = date.dateString;

    const newDates = { ...markedDates };
    if (markedDates[selectedDate]) {
      delete newDates[selectedDate];
    } else {
      newDates[selectedDate] = { customStyles: { container: { width: 90 } }, startingDay: true, textColor: 'white', color: isOffer ? Colors.text.pink : Colors.text.blue, endingDay: true };
    }

    this.setState({ markedDates: newDates, dateSelected: true });
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
    const { time, isFlexible, flexibilityInfo, markedDates, dateSelected } = this.state;
    const { isOffer } = this.props;
    const dates = Object.keys(markedDates);
    const activeMonth = dates.length > 0 && !dateSelected ? dates[0] : '';

    return (
      <View style={styles.wrapper}>
        <SectionLabel color={isOffer ? Colors.text.pink : Colors.text.blue} label={trans('add.date')} />
        <Calendar
          firstDay={1}
          onDayPress={this.onSelectDay}
          markedDates={markedDates}
          markingType={'period'}
          minDate={Moment(new Date()).format('YYYY-MM-DD')}
          hideExtraDays
          current={activeMonth}
          theme={{
            'stylesheet.day.period': {
              base: {
                width: 34,
                height: 34,
                alignItems: 'center',
              },
              todayText: {
                fontWeight: '500',
                color: isOffer ? Colors.text.pink : Colors.text.blue,
              },
            },
          }}
        />
        <View style={styles.section}>
          <SectionLabel color={isOffer ? Colors.text.pink : Colors.text.blue} label={trans('add.is_this_a_recurring_ride')} />
          <AppText style={styles.info}>{trans('add.place_more_balls_in_calendar')}</AppText>
        </View>
        <SectionLabel color={isOffer ? Colors.text.pink : Colors.text.blue} label={trans('add.time')} />
        <TimePicker
          defaultTime={time}
          onChange={value => this.setState({ time: value })}
        />
        <View style={styles.radioRow}>
          <Radio
            active={!isFlexible}
            label={trans('add.exact_time')}
            onPress={() => this.setState({ isFlexible: false })}
            color={isOffer ? 'pink' : 'blue'}
          />
          <Radio
            active={isFlexible}
            label={trans('add.flexible_time')}
            onPress={() => this.setState({ isFlexible: true })}
            color={isOffer ? 'pink' : 'blue'}
          />
        </View>
        {
          isFlexible &&
          <View style={styles.flexibleSection}>
            <AppText color={Colors.text.blue} fontVariation="semibold" style={styles.flexibleLabel}>{trans('add.i_can_go')}</AppText>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Picker
                  mode="dropdown"
                  onValueChange={duration => this.setDuration(duration)}
                  selectedValue={pad(flexibilityInfo.duration.toString())}
                  style={styles.picker}
                >
                  {this.renderMinutesOptions('flexible')}
                </Picker>
              </View>
              <View style={styles.inputWrapper}>
                <Picker
                  mode="dropdown"
                  onValueChange={unit => this.setUnit(unit)}
                  selectedValue={flexibilityInfo.unit}
                  style={styles.picker}
                >
                  {this.renderUnit()}
                </Picker>
              </View>
              <View style={styles.inputWrapper}>
                <Picker
                  mode="dropdown"
                  onValueChange={type => this.setType(type)}
                  selectedValue={flexibilityInfo.type}
                  style={styles.picker}
                >
                  {this.renderType()}
                </Picker>
              </View>
            </View>
          </View>
        }
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.text.pink}
          style={styles.button}
        >
          {trans('global.next')}
        </RoundedButton>
      </View>
    );
  }
}

Date.propTypes = {
  onNext: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape({
    time: PropTypes.string,
    days: PropTypes.array,
    flexibilityInfo: PropTypes.shape({
      duration: PropTypes.number,
      type: PropTypes.string,
      unit: PropTypes.string,
    }),
  }).isRequired,
  isOffer: PropTypes.bool,
};

Date.defaultProps = {
  isOffer: false,
};

export default Date;
