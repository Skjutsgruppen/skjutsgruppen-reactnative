import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const createTrip = gql`
mutation createTrip(
  $comment:String, 
  $type:String!,
  $tripStart:PlaceInput!,
  $tripEnd:PlaceInput!,
  $photo:String,
  $stops:[PlaceInput],
  $returnTrip:Boolean,
  $dates:[String!],
  $time:String!,
  $seats:Int!,
  $flexibility:String,
  $share:[String],
) {
  createTrip( input :{
    comment : $comment
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
    comment 
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
  }
}
`;

export const submitOffer = graphql(createTrip, {
  props: ({ mutate }) => ({
    submit: (
      comment,
      tripStart,
      tripEnd,
      photo,
      stops,
      returnTrip,
      dates,
      time,
      seats,
      flexibility,
      share,
    ) => mutate({
      variables: {
        comment,
        type: 'offered',
        tripStart,
        tripEnd,
        photo,
        stops,
        returnTrip,
        dates,
        time,
        seats,
        flexibility,
        share,
      },
    }),
  }),
});
