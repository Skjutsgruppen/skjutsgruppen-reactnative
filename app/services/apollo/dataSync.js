/* eslint no-empty: "error" */

import client from '@services/apollo';
import { PROFILE_QUERY, ACCOUNT_QUERY } from '@services/apollo/profile';
import { TRIPS_QUERY, GET_FEED_QUERY, FIND_TRIP_QUERY } from '@services/apollo/trip';
import { GROUPS_QUERY } from '@services/apollo/group';
import {
  FEEDABLE_TRIP,
  FEEDABLE_GROUP,
  PER_FETCH_LIMIT,
  FEED_FILTER_WANTED,
  FEED_FILTER_EVERYTHING,
  NOTIFICATION_FETCH_LIMIT,
  FEED_FILTER_OFFERED,
  NOTIFICATION_TYPE_EXPERIENCE_REMOVED,
  NOTIFICATION_TYPE_EXPERIENCE_REJECTED,
} from '@config/constant';
import { FRIEND_QUERY } from '@services/apollo/friend';
import { NOTIFICATION_QUERY, LOCATION_SHARED_TO_ALL_RESOURCES_QUERY } from '@services/apollo/notification';
import { LOCATION_SHARED_TO_SPECIFIC_RESOURCE_QUERY } from '@services/apollo/share';
import { FIND_GROUP_QUERY } from './group';

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

export const increaseProfileFriendsCount = () => {
  try {
    const myAccount = getAccount();

    myAccount.account.totalFriends += 1;
    setAccount(myAccount);
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

export const increaseProfileTripCount = (userId, tripId, type) => {
  let repeated = false;

  try {
    const activeRides = client.readQuery(
      {
        query: TRIPS_QUERY,
        variables: {
          id: null,
          offset: 0,
          limit: PER_FETCH_LIMIT,
          type: FEED_FILTER_OFFERED,
          active: true,
        },
      },
    );

    activeRides.trips.rows.map((row) => {
      if (row.id === tripId) {
        repeated = true;
      }

      return row;
    });
  } catch (err) {
    // empty
  }

  try {
    if (!repeated) {
      const myRides = client.readQuery(
        {
          query: TRIPS_QUERY,
          variables: {
            id: userId,
            offset: 0,
            limit: PER_FETCH_LIMIT,
            type,
            active: null,
          },
        },
      );

      myRides.trips.rows.map((row) => {
        if (row.id === tripId) {
          repeated = true;
        }

        return row;
      });
    }
  } catch (err) {
    // empty
  }

  try {
    if (!repeated) {
      const myAccount = getAccount();

      if (type === FEED_FILTER_WANTED) {
        myAccount.account.totalAsked += 1;
      } else {
        myAccount.account.totalOffered += 1;
      }

      setAccount(myAccount);
    }
  } catch (err) {
    // empty
  }
};

export const increaseProfileGroupCount = (userId, groupId) => {
  let repeated = false;

  try {
    const myGroups = client.readQuery({
      query: GROUPS_QUERY,
      variables: { id: null, offset: 0, limit: PER_FETCH_LIMIT },
    });

    myGroups.groups.rows.map((row) => {
      if (row.id === groupId) {
        repeated = true;
      }

      return row;
    });
  } catch (err) {
    // empty
  }

  try {
    if (!repeated) {
      const profileMyGroups = client.readQuery({
        query: GROUPS_QUERY,
        variables: { id: userId, offset: 0, limit: PER_FETCH_LIMIT },
      });

      profileMyGroups.groups.rows.map((row) => {
        if (row.id === groupId) {
          repeated = true;
        }

        return row;
      });
    }
  } catch (err) {
    // empty
  }

  try {
    if (!repeated) {
      const myAccount = getAccount();

      myAccount.account.totalGroups += 1;
      setAccount(myAccount);
    }
  } catch (err) {
    // error
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

export const updateProfileFriendCount = (userId, apollo, decrease = false) => {
  try {
    apollo.readQuery(
      {
        query: FRIEND_QUERY,
        variables: {
          id: userId,
          offset: 0,
          limit: PER_FETCH_LIMIT,
        },
      },
    );
  } catch (err) {
    try {
      const myAccount = apollo.readQuery(
        { query: ACCOUNT_QUERY },
      );

      if (decrease) {
        myAccount.account.totalFriends -= 1;
      } else {
        myAccount.account.totalFriends += 1;
      }

      apollo.writeQuery(
        { query: ACCOUNT_QUERY, data: myAccount },
      );
    } catch (e) {
      // empty
    }
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

export const updateOtherProfileFriendCount = (friendId, apollo, decrease = false) => {
  try {
    apollo.readQuery(
      {
        query: FRIEND_QUERY,
        variables: {
          id: friendId,
          offset: 0,
          limit: PER_FETCH_LIMIT,
        },
      },
    );
  } catch (err) {
    try {
      if (apollo) {
        const friendProfile = apollo.readQuery({
          query: PROFILE_QUERY,
          variables: { id: friendId },
        });
        if (decrease) {
          friendProfile.profile.totalFriends -= 1;
        } else {
          friendProfile.profile.totalFriends += 1;
        }

        apollo.writeQuery({
          query: PROFILE_QUERY,
          data: friendProfile,
          variables: { id: friendId },
        });
      } else {
        const friendProfile = client.readQuery({
          query: PROFILE_QUERY,
          variables: { id: friendId },
        });
        if (decrease) {
          friendProfile.profile.totalFriends -= 1;
        } else {
          friendProfile.profile.totalFriends += 1;
        }

        client.writeQuery({
          query: PROFILE_QUERY,
          data: friendProfile,
          variables: { id: friendId },
        });
      }
    } catch (e) {
      // empty
    }
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
