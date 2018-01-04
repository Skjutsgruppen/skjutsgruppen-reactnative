import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FEED_TYPE_WANTED } from '@config/constant';

const CREATE_ASK_QUERY = gql`
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
  $flexibility:String,
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
    flexibility : $flexibility
    share : $share
  }) {
    id
    description 
    type 
    TripStart {
      name
      countryCode
      coordinates
    }
    TripEnd {
      name
      countryCode
      coordinates
    }
    photo 
    mapPhoto
    Stops 
    {
      name
      countryCode
      coordinates
    }
    returnTrip 
    date 
    time 
    seats 
    flexibility,
    url
    parentId
  }
}
`;

export const submitAsk = graphql(CREATE_ASK_QUERY, {
  props: ({ mutate }) => ({
    submit: ({
      parentId,
      description,
      photo,
      tripStart,
      tripEnd,
      returnTrip,
      dates,
      time,
      flexibility,
      share,
    }) => mutate({
      variables: {
        parentId,
        description,
        type: FEED_TYPE_WANTED,
        tripStart,
        tripEnd,
        photo,
        stops: null,
        returnTrip,
        dates,
        time,
        seats: 0,
        flexibility,
        share,
      },
    }),
  }),
});
