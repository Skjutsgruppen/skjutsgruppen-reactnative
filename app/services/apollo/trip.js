import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';

const CREATE_TRIP_QUERY = gql`
mutation createTrip(
  $parentId:Int,
  $description:String, 
  $type:TripTypeEnum!,
  $tripStart:PlaceInput!,
  $tripEnd:PlaceInput!,
  $photo:String,
  $stops:[PlaceInput],
  $returnTrip:Boolean,
  $dates:[String!],
  $time:String,
  $seats:Int,
  $flexibilityInfo:FlexibilityInput,
  $share:ShareInput,
) {
  createTrip( input :{
    parentId: $parentId
    description : $description
    type : $type
    TripStart : $tripStart
    TripEnd : $tripEnd
    photo : $photo
    Stops : $stops
    returnTrip : $returnTrip
    dates : $dates
    time : $time
    seats : $seats
    flexibilityInfo : $flexibilityInfo
    share : $share
  }) {
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
      duration
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
`;

export const withCreateTrip = graphql(CREATE_TRIP_QUERY, {
  props: ({ mutate }) => ({
    createTrip: ({
      parentId,
      description,
      tripStart,
      tripEnd,
      photo,
      stops = null,
      returnTrip,
      dates,
      time,
      seats = 0,
      flexibilityInfo,
      share,
      type,
    }) =>
      mutate({
        variables: {
          parentId,
          description,
          type,
          tripStart,
          tripEnd,
          photo,
          stops,
          returnTrip,
          dates,
          time,
          seats,
          flexibilityInfo,
          share,
        },
      }),
  }),
});

export const TRIP_PARTICIPANTS_QUERY = gql`
query tripParticipants($id: Int, $offset: Int, $limit: Int) {
  tripParticipants(id:$id, offset:$offset, limit:$limit){
   rows {
    id 
    email 
    firstName 
    lastName 
    avatar 
   }
   count
  }
}
`;

export const withParticipants = graphql(TRIP_PARTICIPANTS_QUERY, {
  options: ({ id }) => ({
    fetchPolicy: 'cache-and-network',
    variables: { id, offset: 0, limit: PER_FETCH_LIMIT },
  }),
  props: ({
    data: { loading, tripParticipants, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (tripParticipants) {
      rows = tripParticipants.rows;
      count = tripParticipants.count;
    }

    return { tripParticipants: { loading, rows, count, networkStatus, error } };
  },
});
