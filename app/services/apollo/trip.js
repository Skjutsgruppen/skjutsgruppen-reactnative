import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT, FEED_FILTER_EVERYTHING } from '@config/constant';
import { increaseFeedCommentCount } from '@services/apollo/dataSync';

const FEED_SUBSCRIPTION = gql`
subscription{
  feed {
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
      }
    }
    ... on TripFeed {
      Trip {
        id 
        type 
        description 
        seats 
        User {
          id 
          firstName 
          avatar 
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
        totalComments
        isParticipant
        flexibilityInfo {
          duration
          unit
          type
        }
      }
    }
    ... on NewsFeed { 
      News {
        id 
        User {
          id 
          firstName 
          avatar 
        } 
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
        createdAt
        description
        photoUrl
        publishedStatus
        userStatus
        User {
          id 
          firstName 
          avatar 
        } 
      }
    }
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
      }
    }
    ... on TripFeed { 
      Trip {
        id 
        type 
        description 
        seats 
        User {
          id 
          firstName 
          avatar 
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
        totalComments
        isParticipant
        flexibilityInfo {
          duration
          unit
          type
        }
      }
    }
    ... on NewsFeed { 
      News {
        id 
        User {
          id 
          firstName 
          avatar 
        } 
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
        createdAt
        description
        photoUrl
        publishedStatus
        userStatus
        User {
          id 
          firstName 
          avatar 
        } 
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

          const newrows = [subscriptionData.data.feed].concat(prev.getFeed.rows);

          return {
            getFeed: {
              ...prev.getFeed,
              ...{ rows: newrows, count: prev.getFeed.count + 1 },
            },
          };
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
  }) {
      id 
      type 
      description 
      seats 
      User {
        id 
        firstName 
        avatar 
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
      totalComments
      isParticipant
      url
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
    avatar 
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
query trip($id: Int!){
  trip(id: $id){
    id 
    type 
    description 
    seats 
    User {
      id 
      firstName 
      avatar 
      relation {
        id 
        firstName
        avatar
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
    totalComments
    isParticipant
    duration
    experienceStatus
    flexibilityInfo {
      duration
      unit
      type
    }
    Participants {
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
      }
    }
  }
}
`;

export const withTrip = graphql(FIND_TRIP_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, trip = {}, refetch, networkStatus, error } }) => ({
    loading, trip, refetch, networkStatus, error,
  }),
});

const TRIPS_SUBSCRIPTION_QUERY = gql`
  subscription myTrip($userId: Int!){
    myTrip(userId:$userId){
      id 
      type 
      description 
      seats 
      User {
        id 
        firstName 
        avatar 
        relation {
          id 
          firstName
          avatar
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
      time 
      photo 
      mapPhoto
      totalComments
      isParticipant
      experienceStatus
      ownerExperience {
        id
        createdAt
        description
        photoUrl
        publishedStatus
        Trip{
          id
        }
        userStatus
        User {
          id 
          firstName 
          avatar 
        }
      }
      Participants{
        count
      }
    }
  }
`;

export const TRIPS_QUERY = gql`
query trips($id:Int, $type:TripTypeEnum, $active:Boolean, $queryString: String, $limit: Int, $offset: Int, $applyQueryString: Boolean ){ 
  trips(input:{userId:$id, type:$type, active:$active, queryString: $queryString, applyQueryString: $applyQueryString}, limit: $limit, offset: $offset) { 
    rows {
      id
      type 
      description 
      seats 
      User {
        id 
        firstName 
        avatar 
        relation {
          id 
          firstName
          avatar
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
      time 
      photo 
      mapPhoto
      totalComments
      isParticipant
      experienceStatus
      ownerExperience {
        id
        createdAt
        description
        photoUrl
        publishedStatus
        Trip{
          id
        }
        userStatus
        User {
          id 
          firstName 
          avatar 
        }
      }
      Participants{
        count
      }
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
    },
  ) => ({
    variables: { id, offset, limit, type, active, queryString, applyQueryString },
    fetchPolicy: applyQueryString ? 'network-only' : 'cache-and-network',
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
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;
          const newTrip = subscriptionData.data.myTrip;

          rows = prev.trips.rows.filter((row) => {
            if (row.id === newTrip.id) {
              return false;
            }
            count += 1;

            return true;
          });
          rows = [newTrip].concat(rows);

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
    tripFeed(tripId: $tripId){
      remove
      Feed {
        id
        date
        User {
          id
          firstName
          lastName
          avatar
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
            }
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
            }
            description
            Participants {
              User {
                id
                firstName
                lastName
                avatar
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
            User {
              id
              firstName
              lastName
              avatar
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
          }
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
          }
          description
          Participants {
            User {
              id
              firstName
              lastName
              avatar
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
          User {
            id
            firstName
            lastName
            avatar
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
      }
    }
  }
}
`;

export const withTripFeed = graphql(TRIP_FEED_QUERY, {
  options: ({ id, offset, limit = PER_FETCH_LIMIT }) => ({
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

          rows = [];
          count = 0;
          let repeated = false;
          const { Feed, remove } = subscriptionData.data.tripFeed;

          const found = prev.feeds.rows.filter(row => row.id === Feed.id);
          repeated = found.length > 0;
          let prevFeeds = prev.feeds;

          if (!repeated) {
            rows = [Feed].concat(prevFeeds.rows);
            increaseFeedCommentCount(id, (Feed.User.id === userId));
            prevFeeds = { ...prevFeeds, ...{ rows, count: prevFeeds.count + 1 } };
          }

          return { feeds: prevFeeds };
        },
      }),
    };
  },
});
