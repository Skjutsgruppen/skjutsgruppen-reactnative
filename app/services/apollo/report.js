import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const REPORT_QUERY = gql`
    mutation report ($reportableId: ID, $reportable: ReportableEnum, $description: String){
        report(input: {reportableId: $reportableId, reportable: $reportable, description: $description })
    }
`;

export const withReport = graphql(REPORT_QUERY, {
  props: ({ mutate }) => ({
    report: ({
      reportableId,
      reportable,
      description,
    }) =>
      mutate({
        variables: {
          reportableId,
          reportable,
          description,
        },
      }),
  }),
});
