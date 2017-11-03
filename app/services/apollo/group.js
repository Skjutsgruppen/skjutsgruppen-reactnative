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
    $country: String
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
        countryCode : $country
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
const EXPLORE_GROUPS = gql`
query exploreGroups($offset: Int, $limit: Int){
  exploreGroups(offset: $offset, limit: $limit){
  Group {
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
  }
  total
  }
}
`;

export const SEARCH_GROUPS = gql`
query searchGroup($keyword: String!, $offset: Int, $limit: Int){
  searchGroup(keyword: $keyword, offset: $offset, limit: $limit){
   Group {
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
   }
   total
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

export const withExploreGroup = graphql(EXPLORE_GROUPS, {
  name: 'exploreGroups',
  options: {
    notifyOnNetworkStatusChange: true,
    variables: { offset: 0, limit: 5 },
  },
  props: ({ exploreGroups }) => ({ exploreGroups }),
});


export const withSearchGroup = graphql(SEARCH_GROUPS, {
  name: 'searchGroups',
  options: ({ keyword }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { keyword, offset: 0, limit: 5 },
  }),
  props: ({ searchGroups }) => ({ searchGroups }),
});
