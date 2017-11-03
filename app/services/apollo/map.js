import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const NEAR_BY_TRIPS_QUERY = gql`
query nearByTrips($from:[Float]!) {
  nearByTrips (input:{from:$from}){
    id
    date
    root
    startPoint
    StartPlace{
      id
    }
    Routable {
      ...on Trip {
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
  }
}
`;

export const withMapTrips = graphql(NEAR_BY_TRIPS_QUERY, {
  options: ({ lat, lng }) => ({
    notifyOnNetworkStatusChange: true,
    variables: { from: [lat, lng] },
  }),
  props: ({ data }) => {
    const { nearByTrips, loading } = data;
    let trips = [];

    if (nearByTrips) {
      trips = nearByTrips.map((trip) => {
        const { startPoint, Routable } = trip;
        return {
          coordinate: {
            lat: startPoint[0],
            lng: startPoint[1],
          },
          trip: Routable,
        };
      });
    }

    return { trips, loading };
  },
});
