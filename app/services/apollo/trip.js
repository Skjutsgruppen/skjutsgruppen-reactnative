import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT, FEED_FILTER_EVERYTHING, TRIPS_FETCH_LIMIT } from '@config/constant';
import { updateFeedCount } from '@services/apollo/dataSync';

const FEED_SUBSCRIPTION = gql`
subscription {
  feed {
    Feed {
      id
      feedable
      updatedAt
      ... on GroupFeed {
        Group {
          id
          name
          description
          User {
            id
            firstName
            avatar
            deleted
            isSupporter
          }
          outreach
          type
          photo
          mapPhoto
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
          Stops {
            name
            coordinates
          }
          country
          county
          municipality
          locality
          membershipStatus
          totalParticipants
          isAdmin
          Enablers {
            id
            firstName
            avatar
            isSupporter
          }
          isDeleted
          direction
          url
          isDeleted
          membershipStatus
          Enablers {
            id
          }
          isBlocked
        }
      }
      ... on TripFeed {
        Trip {
          id 
          type 
          description  
          direction
          seats
          User {
            id
            firstName
            avatar
            deleted
            isSupporter
            relation {
              path{
                id
                firstName
                avatar
                deleted
                isSupporter
              }
              areFriends
            }
          }
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
          Stops {
            name
            coordinates
          }
          date
          photo
          mapPhoto
          totalFeeds
          flexibilityInfo {
            duration
            unit
            type
          }
          url
          isDeleted
          isBlocked
        }
      }
      ... on NewsFeed {
        News {
          id
          title
          body
          links
          photo
          visibleFrom
          visibleUntil
          updatedAt
          totalComments
        }
      }
      ... on ExperienceFeed{
        Experience{
          id
          photoUrl
          isBlocked          
        }
      }
      ... on GardenStatus {
        User {
          id
          firstName
          avatar
        }
        feedable
        GardenInfo {
          server
          programmer
          projectManager
        }
      }
    }
    remove
  }
}
`;

export const GET_FEED_QUERY = gql`
query getFeed($offset: Int, $limit: Int, $filter:FeedFilter) {
  getFeed (offset:$offset, limit:$limit, filter:$filter){
   totalExperiences
   rows {
    id
    feedable
    updatedAt
    ... on GroupFeed {
      Group {
        id
        name
        description
        User {
          id
          firstName  
          avatar
          deleted
          isSupporter
        }
        outreach
        type
        photo
        mapPhoto
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
        Stops {
          name
          coordinates
        } 
        country 
        county 
        municipality 
        locality
        direction
        url
        membershipStatus
        totalParticipants
        isAdmin
        Enablers {
          id
          firstName
          avatar
          isSupporter
        }
        isDeleted
        membershipStatus
        Enablers {
          id
        }
        isBlocked
      }
    }
    ... on TripFeed {
      Trip {
        id 
        type 
        description  
        direction
        seats
        User {
          id
          firstName
          avatar
          deleted
          isSupporter
          relation {
            path{
              id
              firstName
              avatar
              deleted
              isSupporter
            }
            areFriends
          }
        }
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
        Stops {
          name
          coordinates
        }
        date
        photo
        mapPhoto
        totalFeeds
        flexibilityInfo {
          duration
          unit
          type
        }
        url
        isDeleted
        isBlocked
      }
    }
    ... on NewsFeed {
      News {
        id
        title
        body
        links
        photo
        visibleFrom
        visibleUntil
        updatedAt
        totalComments
      }
    }
    ... on ExperienceFeed{
      Experience{
        id
        photoUrl
        isBlocked
      }
    }
    ... on GardenStatus {
      User {
        id
        firstName
        avatar
      }
      feedable
      GardenInfo {
        server
        programmer
        projectManager
      }
    }
   }
   count
  }
}
`;

export const withFeed = graphql(GET_FEED_QUERY, {
  options: {
    notifyOnNetworkStatusChange: true,
    variables: { offset: 0, limit: PER_FETCH_LIMIT, filter: { type: FEED_FILTER_EVERYTHING } },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
  props: ({
    data: { loading, getFeed, fetchMore, refetch, subscribeToMore, networkStatus, error },
  }) => {
    let totalExperiences = 0;
    let rows = [];
    let count = 0;

    if (getFeed) {
      totalExperiences = getFeed.totalExperiences;
      rows = getFeed.rows;
      count = getFeed.count;
    }

    return {
      feeds: {
        loading,
        totalExperiences,
        rows,
        count,
        fetchMore,
        refetch,
        subscribeToMore,
        networkStatus,
        error,
      },
      subscribeToFeed: () => subscribeToMore({
        document: FEED_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data || !prev.getFeed.rows) {
            return prev;
          }

          rows = [];
          count = 0;
          let repeated = false;

          const { Feed, remove } = subscriptionData.data.feed;

          if (!Feed) {
            return prev;
          }

          const found = prev.getFeed.rows.filter(row => row.id === Feed.id);
          repeated = found.length > 0;
          let prevFeeds = prev.getFeed;

          if (!repeated) {
            rows = [Feed].concat(prevFeeds.rows);
            prevFeeds = { ...prevFeeds, ...{ rows, count: prevFeeds.count + 1 } };
          }

          if (remove) {
            rows = prev.getFeed.rows.filter(row => row.id !== Feed.id);
            prevFeeds = { ...prevFeeds, ...{ rows, count: prevFeeds.count - 1 } };
          }

          return { getFeed: prevFeeds };
        },
      }),
    };
  },
});

const CREATE_TRIP_QUERY = gql`
mutation createTrip(
  $parentId:Int,
  $description:String,
  $type:TripTypeEnum!,
  $tripStart:PlaceInput!,
  $tripEnd:PlaceInput!,
  $photo:String,
  $stops:[PlaceInput],
  $returnTrip:Boolean,
  $dates:[String!],
  $time:String,
  $seats:Int,
  $flexibilityInfo:FlexibilityInput,
  $share:ShareInput,
  $groupId: Int,
  $linkedTripId: Int,
  $direction: directionEnum,
) {
  createTrip( input :{
    parentId: $parentId
    description : $description
    type : $type
    TripStart : $tripStart
    TripEnd : $tripEnd
    photo : $photo
    Stops : $stops
    returnTrip : $returnTrip
    dates : $dates
    time : $time
    seats : $seats
    flexibilityInfo : $flexibilityInfo
    share : $share
    groupId: $groupId
    linkedTripId: $linkedTripId
    direction: $direction
  }) {
    id 
    type 
    description  
    direction
    User {
      id 
      firstName 
      avatar
      deleted
      isSupporter
    } 
    TripStart {
      name 
      coordinates
    } 
    TripEnd {
      name 
      coordinates
    } 
    Stops { 
      name 
      coordinates 
    } 
    date 
    photo 
    mapPhoto
    totalFeeds
    flexibilityInfo {
      duration
      unit
      type
    }
  }
}
`;

export const withCreateTrip = graphql(CREATE_TRIP_QUERY, {
  props: ({ mutate }) => ({
    createTrip: ({
      parentId,
      description,
      tripStart,
      tripEnd,
      photo,
      stops = null,
      returnTrip,
      dates,
      time,
      seats = 0,
      flexibilityInfo,
      share,
      type,
      groupId = null,
      linkedTripId = null,
      direction,
    }) =>
      mutate({
        variables: {
          parentId,
          description,
          type,
          tripStart,
          tripEnd,
          photo,
          stops,
          returnTrip,
          dates,
          time,
          seats,
          flexibilityInfo,
          share,
          groupId,
          linkedTripId,
          direction,
        },
      }),
  }),
});

export const TRIP_PARTICIPANTS_QUERY = gql`
query tripParticipants($id: Int, $offset: Int, $limit: Int) {
  tripParticipants(id:$id, offset:$offset, limit:$limit){
    rows {
      id
      firstName
      lastName
      avatar
      isSupporter
    }
    count
  }
}
`;

export const withParticipants = graphql(TRIP_PARTICIPANTS_QUERY, {
  options: ({ id }) => ({
    variables: { id, offset: 0, limit: PER_FETCH_LIMIT },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({
    data: { loading, tripParticipants, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (tripParticipants) {
      rows = tripParticipants.rows;
      count = tripParticipants.count;
    }

    return { tripParticipants: { loading, rows, count, networkStatus, error } };
  },
});

export const FIND_TRIP_QUERY = gql`
query trip($id: Int!) {
  trip(id: $id) {
    id
    type
    description
    seats
    direction
    User {
      id
      firstName
      avatar
      deleted
      isSupporter
      relation {
          path{
          id
          firstName
          avatar
          deleted
          isSupporter
        }
        areFriends
      }
    }
    TripStart {
      name
      coordinates
      countryCode
    }
    TripEnd {
      name
      coordinates
      countryCode
    }
    Stops {
      name
      coordinates
      countryCode
    }
    Location {
      id
      User {
        id
        avatar
        deleted
        isSupporter
      }
      interval
      duration
      timeFraction
      locationCoordinates
      isLive
    }
    date
    photo
    mapPhoto
    totalFeeds
    isParticipant
    duration
    experienceStatus
    isAdmin
    muted
    url
    unreadNotificationCount
    flexibilityInfo {
      duration
      unit
      type
    }
    Participants {
      rows {
        id
        firstName
        lastName
        avatar
        isSupporter
      }
      count
    }
    ReturnTrip {
      id
      date
      type
      TripStart {
        name
      }
      TripEnd {
        name
      }
      Stops {
        name
      }
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
      }
    }
    Recurring {
      id
      date
      type
      TripStart {
        name
      }
      TripEnd {
        name
      }
      Stops {
        name
      }
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
      }
    }
    Group {
      id
      name
    }
    linkedTrip {
      id
      description
      User {
        id
        firstName
      }
    }
    isDeleted
    isBlocked
  }
}
`;

export const TRIP_SUBSCRIPTION = gql`
subscription onTripUpdated($id: Int!) {
  tripUpdated(tripId: $id){
    id
    type
    description
    seats
    direction
    User {
      id
      firstName
      avatar
      deleted
      isSupporter
      relation {
          path{
          id
          firstName
          avatar
          deleted
          isSupporter
        }
        areFriends
      }
    }
    TripStart {
      name
      coordinates
      countryCode
    }
    TripEnd {
      name
      coordinates
      countryCode
    }
    Stops {
      name
      coordinates
      countryCode
    }
    Location {
      id
      User {
        id
        avatar
        deleted
        isSupporter
      }
      interval
      duration
      timeFraction
      locationCoordinates
      isLive
    }
    date
    photo
    url
    mapPhoto
    totalFeeds
    isParticipant
    duration
    experienceStatus
    isAdmin
    muted
    unreadNotificationCount
    flexibilityInfo {
      duration
      unit
      type
    }
    Participants {
      rows {
        id
        firstName
        lastName
        avatar
        isSupporter
      }
      count
    }
    ReturnTrip {
      id
      date
      type
      TripStart {
        name
      }
      TripEnd {
        name
      }
      Stops {
        name
      }
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
      }
    }
    Recurring {
      id
      date
      type
      TripStart {
        name
      }
      TripEnd {
        name
      }
      Stops {
        name
      }
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
      }
    }
    Group {
      id
      name
    }
    linkedTrip {
      id
      description
      User {
        id
        firstName
      }
    }
    isDeleted
    isBlocked
  }
}
`;

export const withTrip = graphql(FIND_TRIP_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, trip = {}, refetch, networkStatus, error, subscribeToMore } }) => ({
    loading,
    trip,
    refetch,
    networkStatus,
    error,
    subscribeToTrip: id => subscribeToMore({
      document: TRIP_SUBSCRIPTION,
      variables: { id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        return { trip: subscriptionData.data.tripUpdated };
      },
    }),
  }),
});

const TRIPS_SUBSCRIPTION_QUERY = gql`
  subscription myTrip($userId: Int!){
    myTrip(userId:$userId){
      Trip {
        id
        type
        description
        seats
        User {
          id
          firstName
          avatar
          deleted
          isSupporter
          relation {
            path{
              id
              firstName
              avatar
              deleted
              isSupporter
            }
            areFriends
          }
        }
        direction
        TripStart {
          name
          coordinates
        }
        TripEnd {
          name
          coordinates
        }
        Stops {
          name
          coordinates
        }
        date
        time
        photo
        mapPhoto
        totalFeeds
        isParticipant
        experienceStatus
        ownerExperience {
          id
          createdAt
          description
          photoUrl
          publishedStatus
          userStatus
          User {
            id
            firstName
            avatar
            deleted
            isSupporter
          }
        }
        Participants{
          count
        }
        Group {
          id
          name
        }
        linkedTrip {
          id
          description
          User {
            id
            firstName
          }
        }
        muted
        unreadNotificationCount
        isBlocked
      }
      remove
    }
  }
`;

export const TRIPS_QUERY = gql`
query trips($id:Int, $type:TripTypeEnum, $active:Boolean, $queryString: String, $limit: Int, $offset: Int, $applyQueryString: Boolean, $interval: Int ){
  trips(input:{userId:$id, type:$type, active:$active, queryString: $queryString, applyQueryString: $applyQueryString, interval: $interval}, limit: $limit, offset: $offset) {
    rows {
      id
      type
      description
      seats
      User {
        id
        firstName
        avatar
        isSupporter
        deleted
        relation {
          path{
            id
            firstName
            avatar
            deleted
            isSupporter
          }
          areFriends
        }
      }
      direction
      TripStart {
        name
        coordinates
      }
      TripEnd {
        name
        coordinates
      }
      Stops {
        name
        coordinates
      }
      date
      time
      photo
      mapPhoto
      totalFeeds
      isParticipant
      experienceStatus
      ownerExperience {
        id
        createdAt
        description
        photoUrl
        publishedStatus
        userStatus
        User {
          id
          firstName
          avatar
          deleted
          isSupporter
        }
      }
      Participants {
        rows {
          id
          firstName
          lastName
          avatar
          isSupporter
          deleted
        }
        count
      }
      muted
      unreadNotificationCount
      Group {
        id
        name
      }
      linkedTrip {
        id
        description
        User {
          id
          firstName
        }
      }
      flexibilityInfo {
        duration
      }
      duration
      isDeleted
      isBlocked
    }
    count
  }
}
`;

export const withMyTrips = graphql(TRIPS_QUERY, {
  options: (
    {
      id = null,
      offset = 0,
      limit = PER_FETCH_LIMIT,
      type = null,
      active = true,
      queryString = null,
      applyQueryString = false,
      interval = null,
    },
  ) => ({
    variables: { id, offset, limit, type, active, queryString, applyQueryString, interval },
    fetchPolicy: applyQueryString || interval ? 'network-only' : 'cache-and-network',
  }),
  props: (
    { data: { loading, trips, error, networkStatus, refetch, fetchMore, subscribeToMore } },
  ) => {
    let rows = [];
    let count = 0;

    if (trips) {
      rows = trips.rows;
      count = trips.count;
    }

    return {
      trips: { loading, rows, count, error, networkStatus, subscribeToMore, refetch, fetchMore },
      subscribeToNewTrip: param => subscribeToMore({
        document: TRIPS_SUBSCRIPTION_QUERY,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data && !subscriptionData.data.myTrip) {
            return prev;
          }

          rows = [];
          count = 0;
          const newTrip = subscriptionData.data.myTrip;
          const { Trip, remove } = newTrip;

          if (!Trip) {
            return prev;
          }

          rows = prev.trips.rows.filter((row) => {
            if (row.id === Trip.id) {
              return false;
            }
            count += 1;

            return true;
          });

          if (remove) {
            rows = prev.trips.rows.filter(row => row.id !== Trip.id);
            count -= 1;
          } else {
            rows = [Trip].concat(rows);
            count += 1;
          }

          return {
            trips: { ...prev.trips, ...{ rows, count: count + 1 } },
          };
        },
      }),
    };
  },
});

const TRIPS_FEED_SUBSCRIPTION_QUERY = gql`
  subscription tripFeed($tripId: Int) {
    tripFeed(tripId: $tripId) {
      remove
      Feed {
        id
        date
        User {
          id
          firstName
          lastName
          avatar
          deleted
          isSupporter
          relation {
            path{
              id
              firstName
              avatar
              deleted
              isSupporter
            }
            areFriends
          }
        }
        rate
        updatedAt
        ActivityType {
          type
        }
        feedable
        ...on TripCommentActivity{
          Comment: TripComment {
            id
            date
            text
            User {
              id
              firstName
              lastName
              avatar
              deleted
              isSupporter
            }
            isBlocked
          }
        }
        ...on TripExperienceActivity {
          Experience: AddedExperience {
            id
            User {
              id
              firstName
              lastName
              avatar
              deleted
              isSupporter
            }
            description
            Participants {
              User {
                id
                firstName
                lastName
                avatar
                deleted
                isSupporter
              }
              status
            }
            photoUrl
            Trip {
              id
              TripStart {
                name
                coordinates
              }
              TripEnd {
                name
                coordinates
              }
              direction
              date
            }
            published
            publishedStatus
            userStatus
          }
        }
        ...on TripSuggestionActivity {
          Trip: SuggestedTrip {
            id
            description
            date
            seats
            type
            mapPhoto
            direction
            User {
              id
              firstName
              lastName
              avatar
              deleted
              isSupporter
            }
            TripStart {
              name
              coordinates
            }
            TripEnd {
              name
              coordinates
            }
            Stops {
              name
              coordinates
            }
          }
          Suggestion {
            text
          }
        }
        ...on ShareYourLocationFeed {
          Trip {
            id
            date
            TripStart {
              coordinates
            }
            TripEnd {
              coordinates
            }
            isParticipant
            duration
            Participants {
              count
            }
          }
        }
        ...on CreateYourExperienceFeed {
          Trip {
            id
            date
            User {
              id
            }
            isParticipant
            duration
            experienceStatus
            Participants {
              count
            }
          }
        }
      }
    }
  }
`;

const TRIP_FEED_QUERY = gql`
query tripActivities($id: Int!, $limit: Int, $offset: Int) {
  feeds: tripActivities(id: $id, limit: $limit, offset: $offset){
    count
    rows {
      id
      date
      User {
        id
        firstName
        lastName
        avatar
        deleted
        isSupporter
        relation {
          path{
            id
            firstName
            avatar
            deleted
            isSupporter
          }
          areFriends
        }
      }
      rate
      updatedAt
      ActivityType {
        type
      }
      feedable
      ...on TripCommentActivity{
        Comment: TripComment {
          id
          date
          text
          User {
            id
            firstName
            lastName
            avatar
            deleted
            isSupporter
          }
          isBlocked
        }
      }
      ...on TripExperienceActivity {
        Experience: AddedExperience {
          id
          User {
            id
            firstName
            lastName
            avatar
            deleted
            isSupporter
          }
          description
          Participants {
            User {
              id
              firstName
              lastName
              avatar
              deleted
              isSupporter
            }
            status
          }
          photoUrl
          Trip {
            id
            TripStart {
              name
              coordinates
            }
            TripEnd {
              name
              coordinates
            }
            direction
            date
          }
          published
          publishedStatus
          userStatus
          isBlocked
        }
      }
      ...on TripSuggestionActivity {
        Trip: SuggestedTrip {
          id
          description
          date
          seats
          type
          mapPhoto
          direction
          User {
            id
            firstName
            lastName
            avatar
            deleted
            isSupporter
          }
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
          Stops {
            name
            coordinates
          }
          isBlocked
        }
        Suggestion {
          text
        }
      }
      ...on ShareYourLocationFeed {
        Trip {
          id
          date
          TripStart {
            coordinates
          }
          TripEnd {
            coordinates
          }
          isParticipant
          duration
          Participants {
            count
          }
        }
      }
      ...on CreateYourExperienceFeed {
        Trip {
          id
          date
          User {
            id
          }
          isParticipant
          duration
          experienceStatus
          Participants {
            count
          }
        }
      }
    }
  }
}
`;

export const withTripFeed = graphql(TRIP_FEED_QUERY, {
  options: ({ id, offset, limit = TRIPS_FETCH_LIMIT }) => ({
    variables: { id, offset, limit },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data }) => {
    let rows = [];
    let count = 0;
    const { error, fetchMore, feeds, loading, networkStatus, subscribeToMore, refetch } = data;

    if (feeds) {
      rows = feeds.rows.slice(0).reverse();
      count = feeds.count;
    }

    return {
      feeds: { rows, count, fetchMore, loading, error, networkStatus, refetch },
      subscribeToNewFeed: ({ id, userId }) => subscribeToMore({
        document: TRIPS_FEED_SUBSCRIPTION_QUERY,
        variables: { tripId: id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const { Feed, remove } = subscriptionData.data.tripFeed;

          rows = [];
          count = 0;
          let repeated = false;

          const found = prev.feeds.rows.filter(row => row.id === Feed.id);
          repeated = found.length > 0;
          let prevFeeds = prev.feeds;

          if (!repeated) {
            rows = [Feed].concat(prevFeeds.rows);
            updateFeedCount(id, (Feed.User.id === userId));
            prevFeeds = { ...prevFeeds, ...{ rows, count: prevFeeds.count + 1 } };
          }

          if (remove) {
            rows = prev.feeds.rows.filter(row => row.id !== Feed.id);
            updateFeedCount(id, (Feed.User.id === userId), false);
            prevFeeds = { ...prevFeeds, ...{ rows, count: prevFeeds.count - 1 } };
          }

          return { feeds: prevFeeds };
        },
      }),
    };
  },
});

const DELETE_TRIP_QUERY = gql`
  mutation deleteTrip($id: Int!){
    deleteTrip(id: $id)
  }
`;

export const withDeleteTrip = graphql(DELETE_TRIP_QUERY, {
  props: ({ mutate }) => (
    {
      deleteTrip: ({ id }) => mutate({ variables: { id } }),
    }),
});


const EMBED_MUTATION = gql`
  mutation embed($tripId: Int, $groupId: Int){
    embed(tripId: $tripId, groupId: $groupId)
  }
`;

export const withEmbed = graphql(EMBED_MUTATION, {
  props: ({ mutate }) => (
    {
      embed: ({ tripId, groupId }) => mutate({ variables: { tripId, groupId } }),
    }),
});
