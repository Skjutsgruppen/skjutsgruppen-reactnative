/* eslint no-empty: "error" */

import client from '@services/apollo';
import { PROFILE_QUERY, ACCOUNT_QUERY } from '@services/apollo/profile';
import { TRIPS_QUERY, GET_FEED_QUERY, FIND_TRIP_QUERY } from '@services/apollo/trip';
import { GROUPS_QUERY, FIND_GROUP_QUERY } from '@services/apollo/group';
import {
  FEEDABLE_TRIP,
  FEEDABLE_GROUP,
  PER_FETCH_LIMIT,
  FEED_FILTER_EVERYTHING,
  NOTIFICATION_FETCH_LIMIT,
  NOTIFICATION_TYPE_EXPERIENCE_REMOVED,
  NOTIFICATION_TYPE_EXPERIENCE_REJECTED,
} from '@config/constant';
import { FRIEND_QUERY } from '@services/apollo/friend';
import { NOTIFICATION_QUERY, LOCATION_SHARED_TO_ALL_RESOURCES_QUERY } from '@services/apollo/notification';
import { LOCATION_SHARED_TO_SPECIFIC_RESOURCE_QUERY } from '@services/apollo/share';

const isRemovableNotificationType = (type) => {
  const types = [
    NOTIFICATION_TYPE_EXPERIENCE_REMOVED,
    NOTIFICATION_TYPE_EXPERIENCE_REJECTED,
  ];

  return types.indexOf(type) > -1;
};

/* const isRemovableWhenTookAction = (type) => {
  const types = [
    NOTIFICATION_TYPE_MEMBERSHIP_REQUEST,
    NOTIFICATION_TYPE_EXPERIENCE_TAGGED,
    NOTIFICATION_TYPE_FRIEND_REQUEST,
  ];

  return types.indexOf(type) > -1;
}; */

const getAccount = () => client.readQuery({ query: ACCOUNT_QUERY });

const setAccount = data => client.writeQuery({ query: ACCOUNT_QUERY, data });

export const increaseProfileComment = () => {
  try {
    const myAccount = getAccount();

    myAccount.account.totalComments += 1;
    setAccount(myAccount);
  } catch (err) {
    // empty
  }
};

export const increaseFeedCommentCount = (id, isOwner = false) => {
  try {
    const feeds = client.readQuery({
      query: GET_FEED_QUERY,
      variables: { offset: 0, limit: PER_FETCH_LIMIT, filter: { type: FEED_FILTER_EVERYTHING } },
    });

    feeds.getFeed.rows.map((feed) => {
      if (feed.feedable === FEEDABLE_TRIP && feed.Trip.id === id) {
        feed.Trip.totalComments += 1;
        if (isOwner) {
          feed.Trip.isParticipant = true;
        }
      }

      return feed;
    });

    client.writeQuery({
      query: GET_FEED_QUERY,
      data: feeds,
      variables: { offset: 0, limit: PER_FETCH_LIMIT, filter: { type: FEED_FILTER_EVERYTHING } },
    });
  } catch (err) {
    // empty
  }
};

export const updateFeedCount = (id, isOwner = false, increase = true) => {
  try {
    const feeds = client.readQuery({
      query: GET_FEED_QUERY,
      variables: { offset: 0, limit: PER_FETCH_LIMIT, filter: { type: FEED_FILTER_EVERYTHING } },
    });

    feeds.getFeed.rows.map((feed) => {
      if (feed.feedable === FEEDABLE_TRIP && feed.Trip.id === id) {
        if (increase) {
          feed.Trip.totalFeeds += 1;
        } else {
          feed.Trip.totalFeeds -= 1;
        }
        if (isOwner) {
          feed.Trip.isParticipant = true;
        }
      }

      return feed;
    });

    client.writeQuery({
      query: GET_FEED_QUERY,
      data: feeds,
      variables: { offset: 0, limit: PER_FETCH_LIMIT, filter: { type: FEED_FILTER_EVERYTHING } },
    });
  } catch (err) {
    // empty
  }
};

export const increaseProfileFriend = (userId, friend) => {
  try {
    const friends = client.readQuery(
      {
        query: FRIEND_QUERY,
        variables: {
          id: userId,
          offset: 0,
          limit: PER_FETCH_LIMIT,
        },
      },
    );

    friends.friends.rows = [friend].concat(friends.friends.rows);
    friends.friends.count += 1;

    client.writeQuery({
      query: FRIEND_QUERY,
      data: friends,
      variables: {
        id: userId,
        offset: 0,
        limit: PER_FETCH_LIMIT,
      },
    });
  } catch (err) {
    // empty
  }
};

export const updateNewNotificationToOld = (id, apollo) => {
  try {
    const oldNotificationsData = apollo.readQuery({
      query: NOTIFICATION_QUERY,
      variables: { filters: 'old', offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
    });
    const newNotificationsData = apollo.readQuery({
      query: NOTIFICATION_QUERY,
      variables: { filters: 'new', offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
    });
    let rows = [];

    rows = newNotificationsData.notifications.rows.filter((notification) => {
      if (id === notification.id && !isRemovableNotificationType(notification.type)) {
        oldNotificationsData.notifications.rows.push(notification);
        oldNotificationsData.notifications.count += 1;

        return false;
      }

      return true;
    });

    newNotificationsData.notifications.rows = rows;
    newNotificationsData.notifications.count -= 1;

    apollo.writeQuery({
      query: NOTIFICATION_QUERY,
      variables: { filters: 'old', offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
      data: oldNotificationsData,
    });
    apollo.writeQuery({
      query: NOTIFICATION_QUERY,
      variables: { filters: 'new', offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
      data: newNotificationsData,
    });
  } catch (err) {
    // empty
  }
};

export const increaseProfileExperience = () => {
  try {
    const myAccount = getAccount();

    myAccount.account.totalExperiences += 1;
    setAccount(myAccount);
  } catch (err) {
    // empty
  }
};

export const updateFriendshipStatus = (friendId, status, apollo) => {
  try {
    if (apollo) {
      const friendProfile = apollo.readQuery({ query: PROFILE_QUERY, variables: { id: friendId } });
      friendProfile.profile.relationshipType = status;

      apollo.writeQuery({ query: PROFILE_QUERY, data: friendProfile, variables: { id: friendId } });
    } else {
      const friendProfile = client.readQuery({ query: PROFILE_QUERY, variables: { id: friendId } });
      friendProfile.profile.relationshipType = status;

      client.writeQuery({ query: PROFILE_QUERY, data: friendProfile, variables: { id: friendId } });
    }
  } catch (err) {
    // empty
  }
};

export const removeNotification = (notificationId, apollo) => {
  try {
    const myNotifications = apollo.readQuery({
      query: NOTIFICATION_QUERY,
      variables: { filters: 'new', offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
    });

    myNotifications.notifications.rows.filter(row => row.id === notificationId);
    myNotifications.notifications.count -= 1;

    apollo.writeQuery({
      query: NOTIFICATION_QUERY,
      variables: { filters: 'new', offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
      data: myNotifications,
    });
  } catch (err) {
    // empty
  }
};

export const updateActiveRides = (updatedTrip) => {
  try {
    const trips = client.readQuery({
      query: TRIPS_QUERY,
      variables: {
        id: null,
        type: null,
        active: true,
        queryString: null,
        limit: 10,
        offset: 0,
        applyQueryString: false,
      },
    });

    trips.map((trip) => {
      if (trip.id === updatedTrip.id) return updatedTrip;

      return trip;
    });
  } catch (e) {
    // empty
  }
};

export const updateActiveGroups = (updatedGroup) => {
  try {
    const groups = client.readQuery({
      query: GROUPS_QUERY,
      variables: {
        id: null,
        queryString: null,
        limit: 10,
        offset: 0,
        applyQueryString: false,
      },
    });

    groups.map((group) => {
      if (group.id === updatedGroup.id) return updatedGroup;

      return group;
    });
  } catch (e) {
    // empty
  }
};

export const updateSharedLocation = (id, type) => {
  try {
    const sharedLocation = client.readQuery({
      query: LOCATION_SHARED_TO_SPECIFIC_RESOURCE_QUERY,
      variables: {
        resourceId: id,
        resourceType: type,
      },
    });

    const sharedLocationUpdated = [];

    sharedLocation.locationSharedToSpecificResource.forEach((location) => {
      const duration = location.duration - 1;
      const timeFraction = (1 - (location.duration / location.interval)) * 100;

      if (duration > 0) {
        sharedLocationUpdated.push({ ...location, duration, timeFraction });
      }
    });

    client.writeQuery({
      query: LOCATION_SHARED_TO_SPECIFIC_RESOURCE_QUERY,
      variables: {
        resourceId: id,
        resourceType: type,
      },
      data: { locationSharedToSpecificResource: sharedLocationUpdated },
    });

    if (type === FEEDABLE_TRIP) {
      const resource = client.readQuery({
        query: FIND_TRIP_QUERY,
        variables: { id },
      });

      if (resource.trip.Location.id) {
        const duration = resource.trip.Location.duration - 1;
        const timeFraction =
          (1 - (resource.trip.Location.duration / resource.trip.Location.interval)) * 100;

        client.writeQuery({
          query: FIND_TRIP_QUERY,
          variables: { id },
          data: {
            trip: {
              ...resource.trip,
              Location: { ...resource.trip.Location, duration, timeFraction },
            },
          },
        });
      }
    } else if (type === FEEDABLE_GROUP) {
      const resource = client.readQuery({
        query: FIND_GROUP_QUERY,
        variables: { id },
      });

      if (resource.group.Location.id) {
        const duration = resource.group.Location.duration - 1;
        const timeFraction =
          (1 - (resource.group.Location.duration / resource.group.Location.interval)) * 100;

        client.writeQuery({
          query: FIND_GROUP_QUERY,
          variables: { id },
          data: {
            group: {
              ...resource.group,
              Location: { ...resource.group.Location, duration, timeFraction },
            },
          },
        });
      }
    }
  } catch (e) {
    console.warn(e);
  }
};

export const updateNotificationSharedLocation = () => {
  try {
    const sharedLocation = client.readQuery({
      query: LOCATION_SHARED_TO_ALL_RESOURCES_QUERY,
      variables: { offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
    });

    const sharedLocationUpdated = [];

    let count = sharedLocation.locationSharedToAllResources.count;

    sharedLocation.locationSharedToAllResources.rows.forEach((location) => {
      const duration = location.duration - 1;
      const timeFraction = (1 - (location.duration / location.interval)) * 100;

      if (duration > 0) {
        sharedLocationUpdated.push({ ...location, duration, timeFraction });
      } else {
        count -= 1;
      }
    });

    client.writeQuery({
      query: LOCATION_SHARED_TO_ALL_RESOURCES_QUERY,
      variables: { offset: 0, limit: NOTIFICATION_FETCH_LIMIT },
      data: {
        locationSharedToAllResources: {
          ...sharedLocation.locationSharedToAllResources,
          rows: sharedLocationUpdated,
          count,
        },
      },
    });
  } catch (e) {
    console.warn(e);
  }
};

export const resetLocalStorage = () => {
  client.resetStore();
};

const objectGenerator = (details) => {
  const { data } = client.getInitialState();
  const fullData = { ...details };

  Object.keys(details).forEach((key) => {
    if (typeof details[key] === 'object' && details[key] !== null) {
      if (Array.isArray(details[key])) {
        const arrayData = details[key].map((detail) => {
          const arrayId = detail.id;
          if (arrayId in data) {
            return data[arrayId];
          }

          return [];
        });
        fullData[key] = arrayData;
      } else {
        const id = details[key].id;
        if (id in data) {
          fullData[key] = data[id];
        }
      }
    }
  });

  return fullData;
};

export const getTripDetails = (id) => {
  try {
    const storeId = client.dataIdFromObject({ __typename: 'Trip', id });
    const { data } = client.getInitialState();

    if (storeId in data) {
      const tripDetails = data[storeId];

      return objectGenerator(tripDetails);
    }

    return [];
  } catch (err) {
    return [];
  }
};

export const getGroupDetails = (id) => {
  try {
    const storeId = client.dataIdFromObject({ __typename: 'Group', id });
    const { data } = client.getInitialState();

    if (storeId in data) {
      const groupDetails = data[storeId];

      return objectGenerator(groupDetails);
    }

    return [];
  } catch (err) {
    return [];
  }
};

export const getExperienceDetails = (id) => {
  try {
    const storeId = client.dataIdFromObject({ __typename: 'Experience', id });
    const { data } = client.getInitialState();

    if (storeId in data) {
      const experienceDetails = data[storeId];
      console.log(experienceDetails);

      return objectGenerator(experienceDetails);
    }

    return [];
  } catch (err) {
    return [];
  }
};

export const getProfile = (id) => {
  try {
    const profileDetails = client.readQuery({
      query: PROFILE_QUERY,
      variables: { id },
    });

    return profileDetails.profile;
  } catch (err) {
    return {};
  }
};
