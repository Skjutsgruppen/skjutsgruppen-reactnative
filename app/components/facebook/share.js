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
import LangService from '@services/lang';

class Share {
  commentedOnTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: `I've asked ${user} to share a ride between ${tripStart} and ${tripEnd} on ${date}. Click below to see the ride.`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  askedTrip = ({ tripStart, tripEnd, date, id }) => {
    return {
      quote: `I want to share a ride between ${tripStart} and ${tripEnd} on ${date}. Do anyone have a suggestion?`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  offeredTrip = ({ tripStart, tripEnd, date, id }) => {
    return {
      quote: `I'm offering a ride between ${tripStart} and ${tripEnd} on ${date}. Would you like to join?`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  createdGroup = ({ name, id }) => {
    return {
      quote: `I've just added the group ${name} at The #RidesharingMovement. Would you like to rideshare with us?`,
      contentUrl: `https://web.skjutsgruppen.nu/g/${id}`,
      // commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  publishedExperience = ({ id }) => {
    return {
      quote: 'An Experience with The ',
      contentUrl: `https://web.skjutsgruppen.nu/e/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement, #ShareAlike, #ridesharing' },
    };
  }

  shareOfferedTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: `${user} offers a ride between ${tripStart} and ${tripEnd} on ${date}.`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  shareAskedTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: `${user} asks for a ride between ${tripStart} and ${tripEnd} on ${date}.`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  shareGroup = ({ name, id }) => {
    return {
      quote: `Check out the group ${name} at The #RidesharingMovement.`,
      contentUrl: `https://web.skjutsgruppen.nu/g/${id}`,
      // commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  shareLocation = ({ id }) => {
    return {
      quote: "I'm ridesharing right now! See where I am live on this map",
      contentUrl: `https://web.skjutsgruppen.nu/l/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement #ShareAlike' },
    };
  }

  async link(type, details) {
    const language = await LangService.getLanguage();
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
