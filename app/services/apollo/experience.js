
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { PER_FETCH_LIMIT } from '@config/constant';

const EXPERIENCE_QUERY = gql`
mutation experience(
  $id: Int,  
  $description: String,  
  $photo: String,  
  $tripId: Int!, 
  $participants: [Int!],
  $share: ShareInput
) 
{
  experience(
      input : {
          id:$id,
          description:$description,
          photo:$photo,
          tripId:$tripId,
          participants:$participants,
          share:$share,
      }){
      id
    }
}
`;

export const withCreateExperience = graphql(EXPERIENCE_QUERY, {
  props: ({ mutate }) => ({
    createExperience: ({
      id = null,
      description,
      photo,
      tripId,
      participants,
      share = {},
    }) => mutate({
      variables: {
        id,
        description,
        photo,
        tripId,
        participants,
        share,
      },
    }),
  }),
});

const ACCEPT_EXPERIENCE_QUERY = gql`
mutation acceptExperience($id:Int!) {
  acceptExperience(id:$id)
}
`;

export const withAcceptExperience = graphql(ACCEPT_EXPERIENCE_QUERY, {
  props: ({ mutate }) => ({
    acceptExperience: id => mutate({ variables: { id } }),
  }),
});


const REJECT_EXPERIENCE_QUERY = gql`
mutation rejectExperience($id:Int!) {
  rejectExperience(id:$id)
}
`;

export const withRejectExperience = graphql(REJECT_EXPERIENCE_QUERY, {
  props: ({ mutate }) => ({
    rejectExperience: id => mutate({ variables: { id } }),
  }),
});

const MORE_EXPERIENCE_QUERY = gql`
query moreExperiences($exceptId: Int!, $limit: Int, $offset: Int) {
  moreExperiences(exceptId: $exceptId, limit: $limit, offset: $offset) {
    rows{
      id
      createdAt
      description
      photo
      Participants {
        User {
          id 
          email 
          firstName 
          lastName 
          avatar 
        } 
        status
      }
      Trip {
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
        isParticipant
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
      User {
        id 
        firstName 
        lastName 
        email 
        avatar 
      } 
      totalComments
    }
    count
  }
}
`;

export const withMoreExperiences = graphql(MORE_EXPERIENCE_QUERY, {
  options: ({ exceptId, offset = 0, limit = PER_FETCH_LIMIT }) => ({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: ({ offset, limit, exceptId }),
  }),
  props: ({
    data: { loading, moreExperiences, fetchMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (moreExperiences) {
      rows = moreExperiences.rows;
      count = moreExperiences.count;
    }

    return {
      experiences: { loading, rows, count, fetchMore, networkStatus, error },
    };
  },
});

const TRIP_EXPERIENCE_QUERY = gql`
query tripExperiences($tripId: Int!, $limit: Int, $offset: Int) {
  tripExperiences(tripId: $tripId, limit: $limit, offset: $offset) {
    rows{
      id
      createdAt
      description
      photo
      Participants {
        User {
          id 
          email 
          firstName 
          lastName 
          avatar 
        } 
        status
      }
      Trip {
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
        isParticipant
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
      User {
        id 
        firstName 
        lastName 
        email 
        avatar 
      } 
      totalComments
    }
    count
  }
}
`;

export const withTripExperiences = graphql(TRIP_EXPERIENCE_QUERY, {
  options: ({ tripId, offset = 0, limit = PER_FETCH_LIMIT }) => ({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: ({ offset, limit, tripId }),
  }),
  props: ({
    data: { loading, tripExperiences, fetchMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (tripExperiences) {
      rows = tripExperiences.rows;
      count = tripExperiences.count;
    }

    return {
      experiences: { loading, rows, count, fetchMore, networkStatus, error },
    };
  },
});

const GET_EXPERIENCE_QUERY = gql`
query getExperiences($limit: Int, $offset: Int) {
  getExperiences(limit: $limit, offset: $offset) {
    rows{
      id
      createdAt
      description
      photo
      Participants {
        User {
          id 
          email 
          firstName 
          lastName 
          avatar 
        } 
        status
      }
      Trip {
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
        isParticipant
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
      User {
        id 
        firstName 
        lastName 
        email 
        avatar 
      } 
      totalComments
    }
    count
  }
}
`;

export const withGetExperiences = graphql(GET_EXPERIENCE_QUERY, {
  options: ({ offset = 0, limit = PER_FETCH_LIMIT }) => ({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: ({ offset, limit }),
  }),
  props: ({
    data: { loading, getExperiences, fetchMore, networkStatus, error },
  }) => {
    let rows = [];
    let count = 0;

    if (getExperiences) {
      rows = getExperiences.rows;
      count = getExperiences.count;
    }

    return {
      experiences: { loading, rows, count, fetchMore, networkStatus, error },
    };
  },
});
