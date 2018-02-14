import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';

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
      }) 
    {
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
query searchGroup($keyword: String!, $offset: Int, $limit: Int){
  searchGroup(keyword: $keyword, offset: $offset, limit: $limit){
    rows {
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
    }
    count
  }
}
`;
export const withSearchGroup = graphql(SEARCH_GROUPS_QUERY, {
  options: ({ keyword }) => ({
    variables: { keyword, offset: 0, limit: PER_FETCH_LIMIT },
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
    remove
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
`;

export const withGroup = graphql(FIND_GROUP_QUERY, {
  options: ({ id }) => ({
    variables: { id },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, group = {}, refetch, networkStatus, error } }) => ({
    loading, group, refetch, networkStatus, error,
  }),
});

export const GROUP_FEED_QUERY = gql`
query groupFeed( $offset: Int, $limit: Int, $groupId: Int! ){
  groupFeed(offset: $offset, limit: $limit, groupId: $groupId){
    rows {
      id
      date
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
      feedable
      ActivityType {
        type
      }
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
            relation {
              id
              firstName
              avatar
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
}`;

const GROUP_FEED_SUBSCRIPTION = gql`
subscription groupFeed($groupId: Int!){
  groupFeed(groupId: $groupId){
    id
    date
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
    feedable
    ActivityType {
      type
    }
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
          relation {
            id
            firstName
            avatar
          }
        }
      }
    }
  }
}
`;

export const withGroupFeed = graphql(GROUP_FEED_QUERY, {
  options: ({ groupId }) => ({
    variables: { offset: 0, limit: PER_FETCH_LIMIT, groupId },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({
    data: { loading, groupFeed, fetchMore, refetch, subscribeToMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (groupFeed) {
      rows = groupFeed.rows;
      count = groupFeed.count;
    }

    return {
      groupFeed: {
        loading,
        rows,
        count,
        fetchMore,
        refetch,
        subscribeToMore,
        networkStatus,
        error,
      },
      subscribeToGroupFeed: ({ groupId }) => subscribeToMore({
        document: GROUP_FEED_SUBSCRIPTION,
        variables: { groupId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const newrows = [subscriptionData.data.groupFeed].concat(prev.groupFeed.rows);
          return {
            groupFeed: {
              ...prev.groupFeed,
              ...{ rows: newrows, count: prev.groupFeed.count + 1 },
            },
          };
        },
      }),
    };
  },
});

const GROUP_MEMBERS_SUBSCRIPTION_QUERY = gql`
subscription updatedGroupMember($groupId: Int){
  updatedGroupMember(groupId: $groupId){
    User {
      id
      firstName
      avatar
    }
    remove
  }
}
`;

const GROUP_MEMBRES_QUERY = gql`
query groupMembers($id: Int, $limit: Int, $offset: Int){
  groupMembers(id: $id, limit: $limit, offset: $offset){
    rows{
      id
      firstName
      avatar
    }
    count
  }
}
`;

export const withGroupMembers = graphql(GROUP_MEMBRES_QUERY, {
  options: ({ id, offset, limit = 10 }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { id, limit, offset },
    fetchPolicy: 'cache-and-network',
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
        variables: { groupId: param.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const { updatedGroupMember } = subscriptionData.data;
          const { User, remove } = updatedGroupMember;

          if (!remove) {
            rows = [User].concat(prev.groupMembers.rows);
            count += 1;
          } else {
            rows = prev.groupMembers.rows.filter(row => row.id !== User.id);
            count -= 1;
          }

          return { groupMembers: { ...prev.groupMembers, ...{ rows, count } } };
        },
      }),
    };
  },
});

export const GROUPS_QUERY = gql`
query groups($id:Int, $limit: Int, $offset: Int, $queryString: String, $applyQueryString: Boolean){ 
  groups(userId:$id, limit: $limit, offset: $offset, queryString: $queryString, applyQueryString: $applyQueryString) { 
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
  }) =>
    ({
      variables: { id, offset, limit, applyQueryString, queryString },
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
              return false;
            }
            count += 1;

            return true;
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
  query groupTrips($id: Int){
    groupTrips(groupId: $id){
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
    }
  }
`;

export const withGroupTrips = graphql(GROUP_TRIPS_QUERY,
  {
    options: ({ id }) => ({
      notifyOnNetworkStatusChange: true,
      variables: { id },
    }),
    props: ({ data: { loading, groupTrips = [], refetch, networkStatus, error } }) => ({
      loading, groupTrips, refetch, networkStatus, error,
    }),
  },
);
