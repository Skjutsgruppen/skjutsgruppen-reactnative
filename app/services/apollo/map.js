import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const NEAR_BY_TRIPS_QUERY = gql`
query nearByTrips($from:[Float]!) {
  nearByTrips (input:{from:$from}){
    id
    type
    description
    seats
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
    date
    time
    photo
    returnTrip
  }
}
`;

export const withMapTrips = graphql(NEAR_BY_TRIPS_QUERY, {
  options: ({ lat, lng }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { from: [lat, lng] },
  }),
  props: ({ data }) => {
    const { nearByTrips } = data;
    return { trips: nearByTrips || [] };
  },
});
