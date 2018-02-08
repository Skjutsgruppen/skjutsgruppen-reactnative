import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import { withGroupTrips } from '@services/apollo/group';
import SharedTripList from '@components/group/sharedTrip/sharedTripList';
import GroupCalendar from '@components/group/groupCalendar';
import { Wrapper, FloatingNavbar } from '@components/common';

const GroupTrip = withGroupTrips(SharedTripList);
const Calendar = withGroupTrips(GroupCalendar);

const styles = StyleSheet.create({
  calendarIcon: {
    paddingRight: 10,
  },
  groupCalendarContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f6f9fc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  actionLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.text.blue,
  },
  closeWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
    padding: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    elevation: 20,
    backgroundColor: Colors.background.fullWhite,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});

class SharedTrip extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { showCalendar: false, notifierOffset: 0 };
  }

  onDayPress = (date) => {
    const { navigation } = this.props;
    navigation.setParams({ date });
    this.setState({ showCalendar: false });
  }

  handleShowCalender = (show) => {
    this.setState({ showCalendar: show });
  }

  renderCalendar = () => (
    <TouchableOpacity
      style={styles.iconWrapper}
      onPress={() => this.handleShowCalender(true)}
    >
      <Image source={require('@assets/icons/ic_calender.png')} style={styles.moreIcon} />
    </TouchableOpacity>
  );

  render() {
    const { navigation } = this.props;
    const { date, id } = navigation.state.params;

    return (
      <Wrapper>
        <FloatingNavbar handleBack={() => navigation.goBack()} title={date} transparent={false} />
        <GroupTrip id={id} navigation={navigation} />
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => this.handleShowCalender(true)}
        >
          <Image source={require('@assets/icons/ic_calender.png')} style={styles.moreIcon} />
        </TouchableOpacity>
        {
          this.state.showCalendar &&
          <Modal
            animationType="slide"
            transparent
            onRequestClose={() => this.setState({ showCalendar: false })}
            visible={this.state.showCalendar}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.75)' }}>
              <View style={styles.groupCalendarContent}>
                <Calendar id={id} handleDayPress={this.onDayPress} />
                <View style={styles.closeWrapper}>
                  <TouchableOpacity
                    style={styles.closeModal}
                    onPress={() => this.handleShowCalender(false)}
                  >
                    <Text style={styles.actionLabel}>{trans('global.cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        }
      </Wrapper>
    );
  }
}

SharedTrip.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default SharedTrip;
