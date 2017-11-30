import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_TRIP = gql`
mutation createTrip(
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

export const submitOffer = graphql(CREATE_TRIP, {
  props: ({ mutate }) => ({
    submit: ({
      description,
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
    }) => mutate({
      variables: {
        description,
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
