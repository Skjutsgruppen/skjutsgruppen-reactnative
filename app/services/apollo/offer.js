import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FEED_TYPE_OFFER } from '@config/constant';

const CREATE_OFFER_QUERY = gql`
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
    flexibilityInfo {
      duration
      unit
      type
    }
    url
    parentId
  }
}
`;

export const submitOffer = graphql(CREATE_OFFER_QUERY, {
  props: ({ mutate }) => ({
    submit: ({
      parentId,
      description,
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
    }) => mutate({
      variables: {
        parentId,
        description,
        type: FEED_TYPE_OFFER,
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
