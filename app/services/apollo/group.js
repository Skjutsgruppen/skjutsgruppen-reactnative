import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

/* 
 $countryCode: String
 $county: String
 $municipality: String
 $locality: String

countryCode : $countryCode
county : $county
municipality : $municipality
locality : $locality */

const group = gql`
mutation group
(
    $outreach: String!
    $tripStart: PlaceInput!
    $tripEnd: PlaceInput!
    $stops: [PlaceInput]
    $name: String
    $description: String
    $photo: String
    $type: String!
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
        type : $type
      }) 
    {
      outreach,
      url,
      name,
      description,
      photo,
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

export const submitGroup = graphql(group, {
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
        type,
      ) => mutate({
        variables: {
          outreach,
          tripStart,
          tripEnd,
          stops,
          name,
          description,
          photo,
          type,
        },
      }),
    }),
});
