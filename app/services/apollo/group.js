import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const SUBMIT_GROUP = gql`
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

export const submitGroup = graphql(SUBMIT_GROUP, {
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

const JOIN_GROUP = gql`
mutation joinGroup($id: Int!) {
    joinGroup(id:$id)
}
`;

export const withJoinGroup = graphql(JOIN_GROUP, {
  props: ({ mutate }) => ({ submit: id => mutate({ variables: { id } }) }),
});

const EXPLORE_GROUPS = gql`
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
        photo
        relation {
          id,
          email,
          firstName
          photo
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

export const withExploreGroup = graphql(EXPLORE_GROUPS, {
  name: 'exploreGroups',
  options: ({ from, filter }) => ({
    variables: {
      from,
      filter,
      offset: 0,
      limit: 5,
    },
  }),
  props: ({ exploreGroups }) => ({ exploreGroups }),
});

export const SEARCH_GROUPS = gql`
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
        photo
        relation {
          id,
          email,
          firstName
          photo
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
export const withSearchGroup = graphql(SEARCH_GROUPS, {
  name: 'searchGroups',
  options: ({ keyword }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { keyword, offset: 0, limit: 5 },
  }),
  props: ({ searchGroups }) => ({ searchGroups }),
});

export const FIND_GROUP = gql`
query findGroup($id: Int!){
  findGroup(id: $id){
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
      photo
      relation {
        id,
        email,
        firstName
        photo
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
}
`;

export const withFindGroup = graphql(FIND_GROUP, {
  options: ({ id }) => ({
    notifyOnNetworkStatusChange: true,
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
