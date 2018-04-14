import React, { Component } from 'react';
import { withMyTrips } from '@services/apollo/trip';
import PropTypes from 'prop-types';
import LocalNotification from '@services/firebase/scheduler';
import { FETCH_ACTIVE_RIDE_INTERVAL } from '@config/constant';

class ScheduleNotification extends Component {
  async componentWillMount() {
    const { trips } = this.props;
    const { rows } = trips;

    if (rows.length > 0) {
      const scheduleNotifications = await LocalNotification.getScheduledNotifications();
      await Promise.all(
        rows.map(async (row) => {
          if (scheduleNotifications.length < 1) {
            await LocalNotification.schedule(row);
          } else {
            let newRow = true;
            scheduleNotifications.forEach((notification) => {
              if (notification.tripId === row.id) {
                newRow = false;
              }
            });
            if (newRow) {
              await LocalNotification.schedule(row);
            }
          }
        }),
      );
    }
  }

  render() {
    return null;
  }
}

ScheduleNotification.propTypes = {
  trips: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
};

const Notifications = withMyTrips(ScheduleNotification);

const Scheduler = () => (
  <Notifications
    active
    interval={FETCH_ACTIVE_RIDE_INTERVAL}
    type={'everything'}
  />
);

export default Scheduler;
