import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const NEAR_BY_TRIPS_QUERY = gql`
mutation nearByTrips($from:[Float]!) {
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
  }
}
`;

export const withMapTrips = graphql(NEAR_BY_TRIPS_QUERY, {
  props: ({ mutate }) => ({
    getMapTrips: from => mutate({ variables: { from } }),
  }),
});
