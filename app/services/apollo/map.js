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
        parentId
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
            lastName
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
        ReturnTrip {
          id
          date
          TripStart {
            name
            coordinates
          }
          TripEnd {
            name
            coordinates
          }
        }
        Recurring {
          id
          date
        }
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
