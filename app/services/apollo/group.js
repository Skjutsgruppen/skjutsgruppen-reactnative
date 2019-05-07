import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT, FEED_FILTER_EVERYTHING } from '@config/constant';
import { GET_FEED_QUERY } from '@services/apollo/trip';

const CREATE_GROUP_QUERY = gql`
mutation group
(
    $outreach: GroupOutreachEnum!
    $tripStart: PlaceInput
    $tripEnd: PlaceInput
    $stops: [PlaceInput]
    $name: String
    $description: String
    $photo: String
    $countryCode: String
    $countyId: Int
    $municipalityId: Int
    $localityId: Int
    $type: GroupTypeEnum!
    $share: ShareInput
    $direction: directionEnum
)
  {
    group(input : {
        outreach : $outreach
        TripStart : $tripStart
        TripEnd : $tripEnd
        Stops : $stops
        name : $name
        description : $description
        photo : $photo
        countryCode : $countryCode
        countyId : $countyId
        municipalityId : $municipalityId
        localityId : $localityId
        type : $type
        share : $share
        direction: $direction
      })
    {
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
      country
      county
      municipality
      locality
      membershipStatus
      totalParticipants
      isAdmin
      url
      muted
      unreadNotificationCount
      Enablers {
        id
        firstName
        avatar
        isSupporter
      }
    }
}
`;

export const submitGroup = graphql(CREATE_GROUP_QUERY, {
  props: ({ mutate }) => (
    {
      submit: (
        outreach,
        tripStart,
        tripEnd,
        stops,
        name,
        description,
        photo,
        countryCode,
        countyId,
        municipalityId,
        localityId,
        type,
        share,
        direction,
      ) => mutate({
        variables: {
          outreach,
          tripStart,
          tripEnd,
          stops,
          name,
          description,
          photo,
          countryCode,
          countyId,
          municipalityId,
          localityId,
          type,
          share,
          direction,
        },
      }),
    }),
});

const JOIN_GROUP_QUERY = gql`
mutation joinGroup($id: Int!) {
    joinGroup(id:$id)
}
`;

export const withJoinGroup = graphql(JOIN_GROUP_QUERY, {
  props: ({ mutate }) => ({ submit: id => mutate({ variables: { id } }) }),
});

const EXPLORE_GROUPS_QUERY = gql`
query exploreGroups($from: [Float], $filter: ExploreGroupFilterEnum!, $order:String, $offset: Int, $limit: Int){
  exploreGroups(
    input: {
      from: $from
      filter: $filter
      order: $order
      offset: $offset
      limit: $limit
    }
  )
  {
    rows {
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
      muted
      unreadNotificationCount
      url
      isBlocked
    }
    count
  }
}
`;

export const withExploreGroup = graphql(EXPLORE_GROUPS_QUERY, {
  options: ({ from, filter, limit = PER_FETCH_LIMIT, offset = 0 }) => ({
    variables: {
      from,
      filter,
      offset,
      limit,
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, exploreGroups, refetch, fetchMore, networkStatus, error } }) => {
    let rows = [];
    let count = 0;

    if (exploreGroups) {
      rows = exploreGroups.rows;
      count = exploreGroups.count;
    }

    return { exploreGroups: { loading, rows, count, refetch, fetchMore, networkStatus, error } };
  },
});

export const SEARCH_GROUPS_QUERY = gql`
query searchGroup($queryString: String!, $offset: Int, $limit: Int){
  searchGroup(keyword: $queryString, offset: $offset, limit: $limit){
    rows {
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
      muted
      unreadNotificationCount
      url
      isBlocked
    }
    count
  }
}
`;
export const withSearchGroup = graphql(SEARCH_GROUPS_QUERY, {
  options: ({ queryString }) => ({
    variables: { queryString, offset: 0, limit: PER_FETCH_LIMIT },
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { loading, searchGroup, refetch, fetchMore, networkStatus, error } }) => {
    let rows = [];
    let count = 0;

    if (searchGroup) {
      rows = searchGroup.rows;
      count = searchGroup.count;
    }

    return { searchGroup: { loading, rows, count, refetch, fetchMore, networkStatus, error } };
  },

});

const GROUPS_SUBSCRIPTION_QUERY = gql`
subscription myGroup($userId: Int!){
  myGroup(userId: $userId) {
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
      country
      county
      municipality
      locality
      membershipStatus
      totalParticipants
      isAdmin
      muted
      unreadNotificationCount
      Enablers {
        id
        firstName
        avatar
        isSupporter
      }
      Location {
        id
        interval
        duration
        timeFraction
        locationCoordinates
        isLive
      }
      url
      isBlocked
    }
    remove
  }
}
`;

export const GROUPS_SUBSCRIPTION = gql`
  subscription onGroupUpdated($id: Int!) {
    groupUpdated (groupId: $id){
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
      areaCoordinates
      direction
      TripStart {
        name
        countryCode
        coordinates
      }
      TripEnd {
        name
        countryCode
        coordinates
      }
      Stops {
        name
        countryCode
        coordinates
      }
      country
      county
      municipality
      locality
      membershipStatus
      totalParticipants
      isAdmin
      muted
      unreadNotificationCount
      Enablers {
        id
        firstName
        avatar
        isSupporter
      }
      municipalityId
      localityId
      countyId
      countryCode
      hasCreatorLeft
      isDeleted
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
      isBlocked
      url
  }
}
`;

export const FIND_GROUP_QUERY = gql`
query group($id: Int!){
  group(id: $id){
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
    areaCoordinates
    direction
    TripStart {
      name
      countryCode
      coordinates
    }
    TripEnd {
      name
      countryCode
      coordinates
    }
    Stops {
      name
      countryCode
      coordinates
    }
    country
    county
    municipality
    locality
    membershipStatus
    totalParticipants
    isAdmin
    muted
    unreadNotificationCount
    Enablers {
      id
      firstName
      avatar
      isSupporter
    }
    municipalityId
    localityId
    countyId
    countryCode
    hasCreatorLeft
    isDeleted
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
    url
    isBlocked
  }
}
`;

export const withGroup = graphql(FIND_GROUP_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, group = {}, refetch, networkStatus, error, subscribeToMore } }) => ({
    loading,
    group,
    refetch,
    networkStatus,
    error,
    subscribeToGroup: id => subscribeToMore({
      document: GROUPS_SUBSCRIPTION,
      variables: { id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        return { group: subscriptionData.data.groupUpdated };
      },
    }),
  }),
});

export const GROUP_FEED_QUERY = gql`
query groupFeed( $offset: Int, $limit: Int, $groupId: Int! ){
  feeds: groupFeed(offset: $offset, limit: $limit, groupId: $groupId){
    rows {
      id
      date
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
        relation {
          path {
            id
            firstName
            avatar
            deleted
            isSupporter
          }
          areFriends
        }
      }
      feedable
      ActivityType {
        type
      }
      ... on LocationFeed {
        id
        Location {
          locationCoordinates
          interval
          isLive
          duration
          sharedFrom
        }
      }
      ... on GroupFeed {
        Enabler {
          id
          firstName
          avatar
          isSupporter
        }
        updatedField
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
          Location {
            id
            interval
            duration
            timeFraction
            locationCoordinates
            isLive
            sharedFrom
          }
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
          url
          isDeleted
          isBlocked
        }
      }
      ... on CommentFeed {
        Comment {
          id
          groupId
          text
          date
          User {
            id
            avatar
            firstName
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
          isBlocked
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
          isBlocked
          User {
            id
            firstName
            avatar
            deleted
            isSupporter
          }
          Participants {
            User {
              id
              firstName
              avatar
              deleted
              isSupporter
            }
            status
          }
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
        }
      }
    }
    count
  }
}`;

const GROUP_FEED_SUBSCRIPTION = gql`
subscription groupFeed($groupId: Int!){
  groupFeed(groupId: $groupId){
    remove
    Feed {
      id
      date
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
         relation {
          path {
            id
            firstName
            avatar
            deleted
            isSupporter
          }
          areFriends
        }
      }
      feedable
      ActivityType {
        type
      }
      ... on LocationFeed {
        id
        Location {
          locationCoordinates
          interval
          isLive
          duration
          sharedFrom
        }
      }
      ... on GroupFeed {
        Enabler {
          id
          firstName
          avatar
          isSupporter
        }
        updatedField
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
          Location {
            id
            interval
            duration
            timeFraction
            locationCoordinates
            isLive
            sharedFrom
          }
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
          url
          isDeleted
          isBlocked
        }
      }
      ... on CommentFeed {
        Comment {
          id
          groupId
          text
          date
          isBlocked
          User {
            id
            avatar
            firstName
            deleted
            isSupporter
            relation {
              path {
                id
                firstName
                avatar
                deleted
                isSupporter
              }
              areFriends
            }
          }
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
          isBlocked
          User {
            id 
            firstName 
            avatar
            deleted
            isSupporter
          }     
          Participants {
            User {
              id 
              firstName 
              avatar
              deleted
              isSupporter
            }
            status
          }
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
        }
      }
    }
  }
}
`;

export const withGroupFeed = graphql(GROUP_FEED_QUERY, {
  options: ({ id }) => ({
    variables: { offset: 0, limit: PER_FETCH_LIMIT, groupId: id },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({
    data: { loading, feeds, fetchMore, refetch, subscribeToMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (feeds) {
      rows = feeds.rows;
      count = feeds.count;
    }

    return {
      feeds: {
        loading,
        rows,
        count,
        fetchMore,
        refetch,
        subscribeToMore,
        networkStatus,
        error,
      },
      subscribeToNewFeed: ({ id }) => subscribeToMore({
        document: GROUP_FEED_SUBSCRIPTION,
        variables: { groupId: id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data && !subscriptionData.data.groupFeed) {
            return prev;
          }

          const { Feed, remove } = subscriptionData.data.groupFeed;
          rows = [];
          count = 0;
          let repeated = false;

          const found = prev.feeds.rows.filter(row => row.id === Feed.id);
          repeated = found.length > 0;
          let prevFeeds = prev.feeds;

          if (!repeated) {
            rows = [Feed].concat(prevFeeds.rows);
            prevFeeds = { ...prevFeeds, ...{ rows, count: prevFeeds.count + 1 } };
          }

          if (remove) {
            rows = prev.feeds.rows.filter(row => row.id !== Feed.id);
            prevFeeds = { ...prevFeeds, ...{ rows, count: prevFeeds.count - 1 } };
          }

          return { feeds: prevFeeds };
        },
      }),
    };
  },
});

const GROUP_MEMBERS_SUBSCRIPTION_QUERY = gql`
subscription updatedGroupMember($groupId: Int, $enabler: Boolean){
  updatedGroupMember(groupId: $groupId, enabler: $enabler){
    GroupMember {
      id
      User {
        id
        firstName
        lastName
        avatar
        deleted
        isSupporter
      }
      admin
      enabler
    }
    remove
  }
}
`;

const GROUP_MEMBRES_QUERY = gql`
query groupMembers($id: Int, $limit: Int, $offset: Int, $enabler: Boolean, $excludeEnabler: Boolean, $queryString: String, $applyQueryString: Boolean){
  groupMembers(id: $id, limit: $limit, offset: $offset, enabler: $enabler, excludeEnabler: $excludeEnabler, queryString: $queryString, applyQueryString: $applyQueryString){
    rows{
      id
      User{
        id
        firstName
        lastName
        avatar
        isSupporter
        deleted
      }
      admin
      enabler
    }
    count
  }
}
`;

export const withGroupMembers = graphql(GROUP_MEMBRES_QUERY, {
  options: (
    {
      id,
      offset,
      limit = 10,
      enabler = false,
      excludeEnabler = false,
      queryString = null,
      applyQueryString = false,
    },
  ) => ({
    notifyOnNetworkStatusChange: true,
    variables: { id, limit, offset, enabler, excludeEnabler, queryString, applyQueryString },
    fetchPolicy: 'network-only',
  }),
  props: ({
    data: { loading, groupMembers, fetchMore, refetch, networkStatus, error, subscribeToMore } },
  ) => {
    let rows = [];
    let count = 0;

    if (groupMembers) {
      rows = groupMembers.rows;
      count = groupMembers.count;
    }

    return {
      groupMembers: { loading, rows, count, fetchMore, refetch, networkStatus, error },
      subscribeToUpdatedGroupMember: param => subscribeToMore({
        document: GROUP_MEMBERS_SUBSCRIPTION_QUERY,
        variables: { groupId: param.id, enabler: param.enabler || false },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;
          let repeated = false;

          const { updatedGroupMember } = subscriptionData.data;
          const { GroupMember, remove } = updatedGroupMember;
          let prevRequest = prev.groupMembers;

          if (remove) {
            rows = prev.groupMembers.rows.filter(row => row.id !== GroupMember.id);
            prevRequest = { ...prevRequest, ...{ rows, count: prevRequest.count - 1 } };
          } else {
            const found = prev.groupMembers.rows
              .filter(row => row.id === GroupMember.id);
            repeated = found.length > 0;

            if (!repeated) {
              rows = prev.groupMembers.rows.concat([GroupMember]);
              prevRequest = { ...prevRequest, ...{ rows, count: prevRequest.count + 1 } };
            }
          }

          return { groupMembers: prevRequest };
        },
      }),
    };
  },
});

export const GROUPS_QUERY = gql`
query groups($id:Int, $limit: Int, $offset: Int, $queryString: String, $applyQueryString: Boolean, $filterByName: Boolean){
  groups(userId:$id, limit: $limit, offset: $offset, queryString: $queryString, applyQueryString: $applyQueryString, filterByName: $filterByName) {
    rows{
      id
      outreach
      name
      description
      type
      photo
      mapPhoto
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
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
      country
      county
      municipality
      locality
      membershipStatus
      totalParticipants
      isAdmin
      muted
      unreadNotificationCount
      Enablers {
        id
        firstName
        avatar
        isSupporter
      }
      url
      isBlocked
    }
    count
  }
}
`;

export const withMyGroups = graphql(GROUPS_QUERY, {
  options: ({
    id = null,
    offset = 0,
    limit = PER_FETCH_LIMIT,
    applyQueryString = false,
    queryString = null,
    filterByName = false,
  }) =>
    ({
      variables: { id, offset, limit, applyQueryString, queryString, filterByName },
      fetchPolicy: 'cache-and-network',
    }),
  props: (
    { data:
      {
        loading,
        groups,
        error,
        refetch,
        networkStatus,
        fetchMore,
        subscribeToMore,
      },
    },
  ) => {
    let rows = [];
    let count = 0;

    if (groups) {
      rows = groups.rows;
      count = groups.count;
    }

    return {
      groups: { loading, rows, count, error, refetch, networkStatus, fetchMore, subscribeToMore },
      subscribeToNewGroup: param => subscribeToMore({
        document: GROUPS_SUBSCRIPTION_QUERY,
        variables: { userId: param.userId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          rows = [];
          count = 0;
          const newGroup = subscriptionData.data.myGroup;
          const { Group, remove } = newGroup;

          rows = prev.groups.rows.filter((row) => {
            if (row.id === newGroup.id) {
              return null;
            }
            count += 1;

            return row;
          });

          if (remove) {
            rows = prev.groups.rows.filter(row => row.id !== Group.id);
            count -= 1;
          } else {
            rows = [Group].concat(rows);
            count += 1;
          }

          return {
            groups: { ...prev.groups, ...{ rows, count } },
          };
        },
      }),
    };
  },
});

const GROUP_TRIPS_QUERY = gql`
  query groupTrips($id: Int, $filter: TripTypeEnum, $active: Boolean){
    groupTrips(groupId: $id, filter: $filter, active: $active){
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
      seats
      muted
      unreadNotificationCount
      url
      isBlocked
    }
  }
`;

export const withGroupTrips = graphql(GROUP_TRIPS_QUERY,
  {
    options: ({ id, filter = FEED_FILTER_EVERYTHING, active = false }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { id, filter, active },
    }),
    props: ({ data: { loading, groupTrips = [], refetch, networkStatus, error } }) => ({
      loading, groupTrips, refetch, networkStatus, error,
    }),
  },
);

const GROUP_TRIP_CALENDAR_QUERY = gql`
  query groupTripCalendar($id: Int){
    groupTripCalendar(groupId: $id){
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
      seats
      muted
      unreadNotificationCount
      url
      isBlocked
    }
  }
`;

export const withGroupTripCalendar = graphql(GROUP_TRIP_CALENDAR_QUERY,
  {
    options: ({ id }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { id },
    }),
    props: ({ data: { loading, groupTripCalendar = [], refetch, networkStatus, error } }) => ({
      loading, groupTripCalendar, refetch, networkStatus, error,
    }),
  },
);

const GROUP_MEMBERSHIP_REQUEST_SUBSCRIPTION = gql`
  subscription updatedGroupMembershipRequest($groupId: Int!){
    updatedGroupMembershipRequest(groupId: $groupId){
      GroupMembershipRequest {
        id
        User: Member {
          id
          firstName
          lastName
          avatar
          isSupporter
        }
      }
      remove
    }
  }
`;

const GROUPS_IN_COUNTY_QUERY = gql`
  query groupsInCounty($countyId: Int!){
    groupsInCounty(countyId: $countyId){
      Municipality {
        id
        name
        countyId
      }
      Groups {
        rows{
          id
          outreach
          name
          description
          type
          photo
          mapPhoto
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
          country
          county
          municipality
          locality
          membershipStatus
          totalParticipants
          isAdmin
          muted
          unreadNotificationCount
          url
          isBlocked
        }
        count
      }
    }
  }
`;

export const withGroupsInCounty = graphql(GROUPS_IN_COUNTY_QUERY,
  {
    options: ({ countyId }) => ({
      fetchPolicy: 'network-only',
      variable: { countyId },
    }),
    props: ({ data: { loading, groupsInCounty, refetch, networkStatus, error } }) => ({
      loading, groupsInCounty, refetch, networkStatus, error,
    }),
  },
);

const GROUPS_IN_MUNICIPALITY_QUERY = gql`
mutation groupsInMunicipality($municipalityId: Int!, $limit: Int, $offset: Int){
  groupsInMunicipality(municipalityId: $municipalityId, limit: $limit, offset: $offset){
    rows{
      id
      outreach
      name
      description
      type
      photo
      mapPhoto
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
      country
      county
      municipality
      locality
      membershipStatus
      totalParticipants
      isAdmin
      muted
      unreadNotificationCount
      url
      isBlocked
    }
    count
  }
}
`;

export const GROUP_PARTICIPANT_IDS_QUERY = gql`
query groupMembers($id: Int){
  groupMembers(id: $id){
    rows{
      memberId
    }
  }
}
`;

export const withGroupsInMunicipality = graphql(GROUPS_IN_MUNICIPALITY_QUERY, {
  props: ({ mutate }) => (
    {
      groupsInMunicipality: ({ municipalityId, limit = PER_FETCH_LIMIT, offset }) =>
        (mutate({ variables: { municipalityId, limit, offset } })),
    }),
});

const GROUP_MEMBERSHIP_REQUEST_QUERY = gql`
query membershipRequest($id: Int!){
  membershipRequest(id: $id){
    count
    rows {
      id
      User: Member {
        id
        firstName
        lastName
        avatar
        isSupporter
      }
    }
  }
}
`;

export const withGroupMembershipRequest = graphql(GROUP_MEMBERSHIP_REQUEST_QUERY,
  {
    options: ({ id }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { id },
    }),
    props: ({
      data: { loading, membershipRequest, refetch, networkStatus, error, subscribeToMore },
    }) => {
      let rows = [];
      let count = 0;

      if (membershipRequest) {
        rows = membershipRequest.rows;
        count = membershipRequest.count;
      }

      return {
        membershipRequest: { loading, rows, count, error, refetch, networkStatus },
        subscribeToNewRequest: param => subscribeToMore({
          document: GROUP_MEMBERSHIP_REQUEST_SUBSCRIPTION,
          variables: { groupId: param.id },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            rows = [];
            count = 0;
            let repeated = false;

            const requests = subscriptionData.data.updatedGroupMembershipRequest;
            const { GroupMembershipRequest, remove } = requests;
            let prevRequest = prev.membershipRequest;
            const found = prev.membershipRequest.rows
              .filter(row => row.id === GroupMembershipRequest.id);
            repeated = found.length > 0;

            if (remove && repeated) {
              rows = prev.membershipRequest.rows
                .filter(row => row.id !== GroupMembershipRequest.id);
              prevRequest = { ...prevRequest, ...{ rows, count: prevRequest.count - 1 } };
            }

            if (!repeated && !remove) {
              rows = prev.membershipRequest.rows.concat([GroupMembershipRequest]);
              prevRequest = { ...prevRequest, ...{ rows, count: prevRequest.count + 1 } };
            }

            return { membershipRequest: prevRequest };
          },
        }),
      };
    },
  },
);

const ADD_GROUP_ENABLER_QUERY = gql`
  mutation addGroupEnablers($groupId:Int!, $ids: [Int], $self: Boolean){
    addGroupEnablers(groupId: $groupId, ids: $ids, self: $self)
  }
`;

export const withAddGroupEnabler = graphql(ADD_GROUP_ENABLER_QUERY, {
  props: ({ mutate }) => (
    {
      addGroupEnablers: (
        {
          groupId,
          ids,
          self = false,
        },
      ) => mutate({
        variables: { groupId, ids, self },
      }),
    }),
});

const REMOVE_GROUP_ENABLER_QUERY = gql`
  mutation removeGroupEnabler($groupId:Int!, $ids: [Int]){
    removeGroupEnabler(groupId: $groupId, ids: $ids)
  }
`;

export const withRemoveGroupEnabler = graphql(REMOVE_GROUP_ENABLER_QUERY, {
  props: ({ mutate }) => (
    {
      removeGroupEnabler: ({ groupId, ids }) => mutate({
        variables: { groupId, ids },
      }),
    }),
});

const REMOVE_GROUP_PARTICIPANT_QUERY = gql`
  mutation removeGroupParticipant($groupId: Int!, $ids: [Int]){
    removeGroupParticipant(groupId: $groupId, ids: $ids)
  }
`;

export const withRemoveGroupParticipant = graphql(REMOVE_GROUP_PARTICIPANT_QUERY, {
  props: ({ mutate }) => (
    {
      removeGroupParticipant: ({ groupId, ids }) => mutate({ variables: { groupId, ids } }),
    }),
});

const ADD_GROUP_PARTICIPANT_QUERY = gql`
  mutation addGroupParticipant($groupId: Int!, $ids: [Int]){
    addGroupParticipant(groupId: $groupId, ids: $ids)
  }
`;

export const withAddGroupParticipant = graphql(ADD_GROUP_PARTICIPANT_QUERY, {
  props: ({ mutate }) => (
    {
      addGroupParticipant: ({ groupId, ids }) => mutate({ variables: { groupId, ids } }),
    }),
});

const UNREGISTERED_GROUP_MEMBERS_QUERY = gql`
  mutation storeUnregisteredGroupMembers($phoneNumbers: [String!], $groupId: Int!){
    storeUnregisteredGroupMembers(phoneNumbers: $phoneNumbers, groupId: $groupId)
  }
`;

export const withAddUnregisteredParticipants = graphql(UNREGISTERED_GROUP_MEMBERS_QUERY, {
  props: ({ mutate }) => (
    {
      storeUnregisteredParticipants: ({ groupId, phoneNumbers }) =>
        mutate({ variables: { groupId, phoneNumbers } }),
    }),
});

const UPDATE_GROUP_MUTATION_QUERY = gql`
  mutation updateGroup(
    $id: Int,
    $outreach: GroupOutreachEnum!
    $tripStart: PlaceInput
    $tripEnd: PlaceInput
    $stops: [PlaceInput]
    $name: String
    $description: String
    $photo: String
    $countryCode: String
    $countyId: Int
    $municipalityId: Int
    $localityId: Int
    $type: GroupTypeEnum!
    $direction: directionEnum
   ){
    updateGroup(
      input : {
        id: $id
        outreach : $outreach
        TripStart : $tripStart
        TripEnd : $tripEnd
        Stops : $stops
        name : $name
        description : $description
        photo : $photo
        countryCode : $countryCode
        countyId : $countyId
        municipalityId : $municipalityId
        localityId : $localityId
        type : $type,
        direction: $direction
      }
    )
  }
`;

export const withUpdateGroup = graphql(UPDATE_GROUP_MUTATION_QUERY, {
  props: ({ mutate }) => (
    {
      updateGroup: ({
        outreach,
        tripStart,
        tripEnd,
        stops,
        name,
        description,
        photo,
        countryCode,
        countyId,
        municipalityId,
        localityId,
        type,
        id,
        direction,
      }) =>
        mutate({
          variables: {
            outreach,
            tripStart,
            tripEnd,
            stops,
            name,
            description,
            photo,
            countryCode,
            countyId,
            municipalityId,
            localityId,
            type,
            id,
            direction,
          },
        }),
    }),
});

const DELETE_GROUP_QUERY = gql`
  mutation deleteGroup($id: Int!){
    deleteGroup(id: $id)
  }
`;

export const withDeleteGroup = graphql(DELETE_GROUP_QUERY, {
  props: ({ mutate }) => (
    {
      deleteGroup: ({ id }) => mutate({
        variables: { id },
        refetchQueries: [
          {
            query: GET_FEED_QUERY,
            variables: {
              offset: 0,
              limit: PER_FETCH_LIMIT,
              filter: { type: FEED_FILTER_EVERYTHING },
            },
          },
        ],
      }),
    }),
});

const INITIAL_ALPHABET_GROUP_QUERY = gql`
query alphabetisedGroups{
  alphabetisedGroups{
    alphabet
  }
}
`;

export const withInitialAlphabetGroup = graphql(INITIAL_ALPHABET_GROUP_QUERY, {
  options: () => ({
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { alphabetisedGroups } }) => {
    return ({
      alphabetisedGroups,
    });
  },
});

const ALPHABETISED_GROUPS_QUERY = gql`
query alphabetisedGroups{
  alphabetisedGroups{
    alphabet
    Groups {
      rows{
        id
        outreach
        name
        description
        type
        photo
        mapPhoto
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
        country
        county
        municipality
        locality
        membershipStatus
        totalParticipants
        isAdmin
        muted
        unreadNotificationCount
        url
        isBlocked
      }
      count
    }
  }
}`;

export const withAlphabetisedGroups = graphql(ALPHABETISED_GROUPS_QUERY, {
  options: () => ({
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, alphabetisedGroups, refetch, networkStatus, error } }) => ({
    loading, alphabetisedGroups, refetch, networkStatus, error,
  }),
});


const SEARCH_ALPHABETISED_GROUP_QUERY = gql`
mutation alphabetisedGroup ($startCharacter: String!, $limit: Int, $offset: Int){
  alphabetisedGroup (startCharacter: $startCharacter, limit: $limit, offset: $offset){
    rows{
      id
      outreach
      name
      description
      type
      photo
      mapPhoto
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
      country
      county
      municipality
      locality
      membershipStatus
      totalParticipants
      isAdmin
      muted
      unreadNotificationCount
      url
      isBlocked
    }
    count
  }
}`;

export const withSearchAlphabetisedGroup = graphql(SEARCH_ALPHABETISED_GROUP_QUERY, {
  props: ({ mutate }) => (
    {
      searchAlphabetisedGroup: ({ startCharacter, limit = PER_FETCH_LIMIT, offset }) =>
        (mutate({ variables: { startCharacter, limit, offset } })),
    }),
});

const NEAR_BY_GROUPS_QUERY = gql`
query nearByGroups($from: [Float]!,
  $distFrom: Int!,
  $distTo: Int!,
  $type: GroupTypeEnum,
  $outreach: GroupOutreachEnum,
  $limit: Int,
  $offset: Int,
  $diameter: Int,
){
  nearByGroups(input: {
    from: $from,
    distFrom: $distFrom,
    distTo: $distTo,
    type: $type,
    outreach: $outreach,
    limit: $limit,
    offset: $offset,
    diameter: $diameter,
  }) {
    rows {
      id
      outreach
      name
      description
      type
      photo
      mapPhoto
      User {
        id
        firstName
        avatar
        deleted
        isSupporter
      }
      areaCoordinates
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
      Enablers {
        id
        firstName
        avatar
        deleted
        isSupporter
      }
      locality
      membershipStatus
      totalParticipants
      isAdmin
      muted
      unreadNotificationCount
      url
      isBlocked
    }
    count
  }
}
`;

export const withNearByGroups = graphql(NEAR_BY_GROUPS_QUERY, {
  options: ({
    from, distFrom, distTo, type, outreach, limit = PER_FETCH_LIMIT, offset, diameter = null,
  }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { from, distFrom, distTo, type, outreach, limit, offset, diameter },
    fetchPolicy: 'cache-and-network',
  }),
  props: (
    { data: {
      loading,
      nearByGroups,
      error,
      refetch,
      networkStatus,
      fetchMore,
    } }) => ({ loading, nearByGroups, error, refetch, networkStatus, fetchMore }),
});

export const withGroupParticipantIds = graphql(GROUP_PARTICIPANT_IDS_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, groupMembers, refetch, networkStatus, error } }) => ({
    data: {
      loading,
      groupMemberIds: groupMembers ? groupMembers.rows.map(m => m.memberId) : [],
      refetch,
      networkStatus,
      error,
    },
  }),
});
