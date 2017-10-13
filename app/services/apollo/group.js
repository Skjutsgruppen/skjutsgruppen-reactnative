import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const group = gql`
mutation group
(
    $outreach: String!
    $tripStart: PlaceInput
    $tripEnd: PlaceInput
    $stops: [PlaceInput]
    $name: String
    $description: String
    $photo: String
    $country: String
    $county: String
    $municipality: String
    $locality: String
    $type: String!
    $share: String
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
        country : $country
        county : $county
        municipality : $municipality
        locality : $locality
        type : $type
        share : $share
      }) 
    {
      outreach,
      url,
      name,
      description,
      photo,
      countryId,
      countyId,
      municipalityId,
      localityId,
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
        country,
        county,
        municipality,
        locality,
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
          country,
          county,
          municipality,
          locality,
          type,
          share,
        },
      }),
    }),
});
