import { ShareDialog } from 'react-native-fbsdk';
import {
  GROUP_FEED_TYPE_COMMENT,
  FEED_TYPE_WANTED,
  FEED_TYPE_OFFER,
  FEEDABLE_GROUP,
  FEEDABLE_TRIP,
  FEEDABLE_EXPERIENCE,
  EXPERIENCE_STATUS_PUBLISHED,
  OFFERED_TRIP_SHARED,
  WANTED_TRIP_SHARED,
  GROUP_SHARED,
  FEEDABLE_LOCATION,
} from '@config/constant';
import { getDate } from '@config';
import { trans } from '@lang/i18n';

class Share {
  commentedOnTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: trans('facebook.commented_on_trip', { user, tripStart, tripEnd, date }),
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: trans('facebook.ridesharing_movement') },
    };
  }

  askedTrip = ({ tripStart, tripEnd, date, id }) => {
    return {
      quote: trans('facebook.asked_trip', { tripStart, tripEnd, date }),
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: trans('facebook.ridesharing_movement') },
    };
  }

  offeredTrip = ({ tripStart, tripEnd, date, id }) => {
    return {
      quote: trans('facebook.offered_trip', { tripStart, tripEnd, date }),
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: trans('facebook.ridesharing_movement') },
    };
  }

  createdGroup = ({ name, id }) => {
    return {
      quote: trans('facebook.created_group', { name }),
      contentUrl: `https://web.skjutsgruppen.nu/g/${id}`,
      // commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  publishedExperience = ({ id }) => {
    return {
      quote: trans('facebook.published_experience'),
      contentUrl: `https://web.skjutsgruppen.nu/e/${id}`,
      commonParameters: { hashtag: `${trans('facebook.ridesharing_movement')},${trans('facebook.share_a_like')}` },
    };
  }

  shareOfferedTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: trans('facebook.share_offered_trip', { user, tripStart, tripEnd, date }),
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: trans('facebook.ridesharing_movement') },
    };
  }

  shareAskedTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: trans('facebook.share_asked_Trip', { user, tripStart, tripEnd, date }),
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: trans('facebook.ridesharing_movement') },
    };
  }

  shareGroup = ({ name, id }) => {
    return {
      quote: trans('facebook.share_group', { name }),
      contentUrl: `https://web.skjutsgruppen.nu/g/${id}`,
      // commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  shareLocation = ({ id }) => {
    return {
      quote: trans('facebook.share_location'),
      contentUrl: `https://web.skjutsgruppen.nu/l/${id}`,
      commonParameters: { hashtag: `${trans('facebook.ridesharing_movement')},${trans('facebook.share_a_like')}` },
    };
  }

  async link(type, details) {
    let shareLinkContent = {};

    if (type === GROUP_FEED_TYPE_COMMENT) {
      shareLinkContent = this.commentedOnTrip(
        {
          ...details,
          ...{
            tripStart: details.TripStart.name || details.direction,
            tripEnd: details.TripEnd.name || details.direction,
            user: details.User.firstName,
            date: getDate(details.date).format('MMM DD, YYYY'),
          },
        },
      );
    }

    if (type === FEEDABLE_TRIP && details.type === FEED_TYPE_WANTED) {
      shareLinkContent = this.askedTrip(
        {
          ...details,
          ...{
            tripStart: details.TripStart.name || details.direction,
            tripEnd: details.TripEnd.name || details.direction,
            date: getDate(details.date).format('MMM DD, YYYY'),
          },
        },
      );
    }

    if (type === FEEDABLE_TRIP && details.type === FEED_TYPE_OFFER) {
      shareLinkContent = this.offeredTrip(
        {
          ...details,
          ...{
            tripStart: details.TripStart.name || details.direction,
            tripEnd: details.TripEnd.name || details.direction,
            date: getDate(details.date).format('MMM DD, YYYY'),
          },
        },
      );
    }

    if (type === FEEDABLE_GROUP) {
      shareLinkContent = this.createdGroup(details);
    }

    if (type === FEEDABLE_EXPERIENCE && details.publishedStatus === EXPERIENCE_STATUS_PUBLISHED) {
      shareLinkContent = this.publishedExperience(details);
    }

    if (type === FEEDABLE_TRIP && details.type === OFFERED_TRIP_SHARED) {
      shareLinkContent = this.shareOfferedTrip(
        {
          ...details,
          ...{
            tripStart: details.TripStart.name || details.direction,
            tripEnd: details.TripEnd.name || details.direction,
            user: details.User.firstName,
            date: getDate(details.date).format('MMM DD, YYYY'),
          },
        },
      );
    }

    if (type === FEEDABLE_TRIP && details.type === WANTED_TRIP_SHARED) {
      shareLinkContent = this.shareAskedTrip(
        {
          ...details,
          ...{
            tripStart: details.TripStart.name || details.direction,
            tripEnd: details.TripEnd.name || details.direction,
            user: details.User.firstName,
            date: getDate(details.date).format('MMM DD, YYYY'),
          },
        },
      );
    }

    if (type === GROUP_SHARED) {
      shareLinkContent = this.shareGroup(details);
    }

    if (type === FEEDABLE_LOCATION) {
      shareLinkContent = this.shareLocation(details);
    }

    shareLinkContent = { ...shareLinkContent, ...{ contentType: 'link' } };
    console.log(shareLinkContent);
    try {
      const canShow = await ShareDialog.canShow(shareLinkContent);
      if (canShow) {
        await ShareDialog.show(shareLinkContent);
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export default new Share();
