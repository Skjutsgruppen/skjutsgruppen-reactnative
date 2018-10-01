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
import { APP_URL } from '@config';

class Share {
  getContentUrl = (type, details) => {
    const id = details.id;
    if (type === GROUP_FEED_TYPE_COMMENT) {
      return `${APP_URL}/t/${id}`;
    }

    if (type === FEED_TYPE_WANTED) {
      return `${APP_URL}/t/${id}`;
    }

    if (type === FEED_TYPE_OFFER) {
      return `${APP_URL}/t/${id}`;
    }

    if (type === FEEDABLE_GROUP) {
      return `${APP_URL}/g/${id}`;
    }

    if (type === FEEDABLE_EXPERIENCE && details.publishedStatus === EXPERIENCE_STATUS_PUBLISHED) {
      return `${APP_URL}/e/${id}`;
    }

    if (type === FEEDABLE_TRIP && details.type === OFFERED_TRIP_SHARED) {
      return `${APP_URL}/t/${id}`;
    }

    if (type === FEEDABLE_TRIP && details.type === WANTED_TRIP_SHARED) {
      return `${APP_URL}/t/${id}`;
    }

    if (type === GROUP_SHARED) {
      return `${APP_URL}/g/${id}`;
    }

    if (type === FEEDABLE_LOCATION) {
      return `${APP_URL}/l/${id}`;
    }

    return '';
  }

  async link(type, details) {
    console.log(type, details);
    const contentUrl = this.getContentUrl(type, details);
    const shareLinkContent = { contentType: 'link', contentUrl };
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
