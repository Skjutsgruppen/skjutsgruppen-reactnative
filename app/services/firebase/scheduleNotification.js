import React, { Component } from 'react';
import { withMyTrips } from '@services/apollo/trip';
import PropTypes from 'prop-types';
import LocalNotification from '@services/firebase/scheduler';
import { FETCH_ACTIVE_RIDE_INTERVAL } from '@config/constant';

class ScheduleNotification extends Component {
  async componentWillReceiveProps({ trips }) {
    if (!trips.loading) {
      const { rows } = trips;
      if (rows.length > 0) {
        await LocalNotification.removeScheduledNotifications();
        rows.forEach((row) => {
          if (!row.muted && row.Participants && row.Participants.count > 1) {
            LocalNotification.schedule(row);
          }
        });
      }
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
