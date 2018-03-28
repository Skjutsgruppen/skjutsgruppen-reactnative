
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const COUNTY_QUERY = gql`
query {
  counties {
    id
    name
    photoUrl
    }
  }
`;

export const withCounties = graphql(COUNTY_QUERY, {
  props: ({ data: { loading, counties } }) => ({
    countyLoading: loading, counties: counties || [],
  }),
});

const MUNICIPALITY_QUERY = gql`
query municipalities($countyId:Int) {
  municipalities (countyId:$countyId) {
    id
    name
    }
  }
`;

export const withMunicipalities = graphql(MUNICIPALITY_QUERY, {
  options: ({ countyId }) => ({ variables: { countyId } }),
  props: ({ data: { loading, municipalities } }) => ({
    loading, list: municipalities || [],
  }),
});

const LOCALITY_QUERY = gql`
query localities($municipalityId:Int) {
  localities (municipalityId:$municipalityId) {
    id
    name
    }
  }
`;

export const withLocalities = graphql(LOCALITY_QUERY, {
  options: ({ municipalityId }) => ({ variables: { municipalityId } }),
  props: ({ data: { loading, localities } }) => ({
    loading, list: localities || [],
  }),
});
