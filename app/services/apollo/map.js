import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const NEAR_BY_TRIPS_QUERY = gql`
mutation nearByTrips($from:[Float]!, $distFrom:Int!, $distTo:Int!, $filter: TripTypeEnum, $active: Boolean ) {
  nearByTrips (input:{from:$from,distFrom:$distFrom, distTo:$distTo, filter:$filter, active: $active}){
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
        totalFeeds
        isParticipant
        direction
      }
    }
  }
}
`;

export const withMapTrips = graphql(NEAR_BY_TRIPS_QUERY, {
  props: ({ mutate }) => ({
    getMapTrips: (from, distFrom, distTo, filter, active: false) => mutate({
      variables: { from, distFrom, distTo, filter, active },
      fetchPolicy: 'cache-and-network',
    }),
  }),
});
