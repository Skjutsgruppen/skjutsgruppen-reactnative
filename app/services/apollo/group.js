import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SUBMIT_GROUP_QUERY = gql`
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
      outreach,
      url,
      name,
      description,
      photo,
      country,
      county,
      municipality,
      locality,
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
      type
    }
}
`;

export const submitGroup = graphql(SUBMIT_GROUP_QUERY, {
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
      outreach
      name
      description
      type
      photo
      User {
        id
        email
        firstName
        lastName
        avatar
        relation {
          id,
          email,
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
      country
      county
      municipality
      locality
      GroupMembers{
        id
      }
      GroupMembershipRequests{
        id
        status
        Member {
          id
          email
          firstName
        }
      }
    } 
    count
  }
}
`;

export const withExploreGroup = graphql(EXPLORE_GROUPS_QUERY, {
  options: ({ from, filter }) => ({
    variables: {
      from,
      filter,
      offset: 0,
      limit: 5,
    },
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
      outreach
      name
      description
      type
      photo
      User {
        id
        email
        firstName
        lastName
        avatar
        relation {
          id,
          email,
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
      country
      county
      municipality
      locality
      GroupMembers{
        id
      }
      GroupMembershipRequests{
        id
        status
        Member {
          id
          email
          firstName
        }
      }
    }
    count
  }
}
`;
export const withSearchGroup = graphql(SEARCH_GROUPS_QUERY, {
  options: ({ keyword }) => ({
    variables: { keyword, offset: 0, limit: 5 },
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

export const FIND_GROUP_QUERY = gql`
query findGroup($id: Int!){
  findGroup(id: $id){
    id
    outreach
    name
    description
    type
    photo
    mapPhoto
    User {
      id
      email
      firstName
      lastName
      avatar
      relation {
        id,
        email,
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
    country
    county
    municipality
    locality
    GroupMembers{
      id
      photo
    }
    GroupMembershipRequests{
      id
      status
      Member {
        id
        email
        firstName
      }
    }
    }
}
`;

export const withFindGroup = graphql(FIND_GROUP_QUERY, {
  options: ({ id }) => ({
    variables: { id },
  }),
  props: ({ data: { loading, findGroup, refetch, networkStatus, error } }) => {
    let group = {};

    if (findGroup) {
      group = findGroup;
    }

    return { loading, group, refetch, networkStatus, error };
  },
});

export const GROUP_FEED_QUERY = gql`
query groupFeed( $offset: Int, $limit: Int, $groupId: Int! ){
  groupFeed(offset: $offset, limit: $limit, groupId: $groupId){
    rows {
      id
      date
      User {
        id
        email
        avatar
        phoneNumber
        firstName
        lastName
      }
      rate
      updatedAt
      feedable
      ActivityType {
        type
        rank
      }
      ... on GroupFeed {
        Group {
          id
          outreach
          name
          description
          type
          photo
          mapPhoto
          User {
            id
            email
            firstName
            lastName
            avatar
            relation {
              id
              email
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
          country
          county
          municipality
          locality
          GroupMembers {
            id
          }
          GroupMembershipRequests {
            id
            status
            Member {
              id
              email
              firstName
            }
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
            email
            firstName
            lastName
            avatar
            relation {
              id
              email
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
          returnTrip
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
            email
            avatar
            firstName
            lastName
            relation {
              id
              email
              firstName
              avatar
            }
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
      email
      avatar
      phoneNumber
      firstName
      lastName
    }
    rate
    updatedAt
    feedable
    ActivityType {
      type
      rank
    }
    ... on GroupFeed {
      Group {
        id
        outreach
        name
        description
        type
        photo
        mapPhoto
        User {
          id
          email
          firstName
          lastName
          avatar
          relation {
            id
            email
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
        country
        county
        municipality
        locality
        GroupMembers {
          id
        }
        GroupMembershipRequests {
          id
          status
          Member {
            id
            email
            firstName
          }
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
          email
          firstName
          lastName
          avatar
          relation {
            id
            email
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
        returnTrip
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
          email
          avatar
          firstName
          lastName
          relation {
            id
            email
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
    variables: { offset: 0, limit: 10, groupId },
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
