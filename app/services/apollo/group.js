import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT, FEED_FILTER_EVERYTHING } from '@config/constant';

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
      isAdmin
      url
      muted
      unreadNotificationCount
      Enablers {
        id
        firstName
        avatar
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
      isAdmin
      Enablers {
        id
        firstName
        avatar
      }
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
      isAdmin
      Enablers {
        id
        firstName
        avatar
      }
    }
    count
  }
}
`;
export const withSearchGroup = graphql(SEARCH_GROUPS_QUERY, {
  options: ({ keyword }) => ({
    variables: { keyword, offset: 0, limit: PER_FETCH_LIMIT },
    fetchPolicy: 'cache-and-network',
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
      muted
      unreadNotificationCount
      Enablers {
        id
        firstName
        avatar
      }
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
      }
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
  feeds: groupFeed(offset: $offset, limit: $limit, groupId: $groupId){
    rows {
      id
      date
      User {
        id 
        firstName 
        avatar 
        relation {
          path {
            id
            firstName
            avatar
          }
          areFriends
        }
      }
      Enabler {
        id 
        firstName 
        avatar
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
          isAdmin
          Enablers {
            id
            firstName
            avatar
          }
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
          totalFeeds
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
              path{
                id
                firstName
                avatar
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
          User {
            id 
            firstName 
            avatar 
          }     
          Participants {
            User {
              id 
              firstName 
              avatar 
            }
            status
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
         relation {
          path {
            id
            firstName
            avatar
          }
          areFriends
        }
      }
      Enabler {
        id
        firstName
        avatar
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
          isAdmin
          Enablers {
            id 
            firstName
            avatar
          }
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
          totalFeeds
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
              path {
                id
                firstName
                avatar
              }
              areFriends
            }
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
          if (!subscriptionData.data) {
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
      muted
      unreadNotificationCount
      Enablers {
        id
        firstName
        avatar
      }
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
  query groupTrips($id: Int, $filter: TripTypeEnum){
    groupTrips(groupId: $id, filter: $filter){
      id 
      type 
      description 
      seats 
      User {
        id 
        firstName 
        avatar 
        relation {
          path{
            id
            firstName
            avatar
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
      time 
      photo 
      mapPhoto
      totalFeeds
      isParticipant
      seats
      muted
      unreadNotificationCount
    }
  }
`;

export const withGroupTrips = graphql(GROUP_TRIPS_QUERY,
  {
    options: ({ id, filter = FEED_FILTER_EVERYTHING }) => ({
      fetchPolicy: 'cache-and-network',
      variables: { id, filter },
    }),
    props: ({ data: { loading, groupTrips = [], refetch, networkStatus, error } }) => ({
      loading, groupTrips, refetch, networkStatus, error,
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
        }
      }
      remove
    }
  }
`;

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
