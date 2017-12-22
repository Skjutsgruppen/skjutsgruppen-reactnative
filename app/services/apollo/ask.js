import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const CREATE_ASK_QUERY = gql`
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

export const submitAsk = graphql(CREATE_ASK_QUERY, {
  props: ({ mutate }) => ({
    submit: ({
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
        description,
        type: 'wanted',
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
