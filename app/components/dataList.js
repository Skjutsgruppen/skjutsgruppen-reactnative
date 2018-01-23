import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Loading } from '@components/common';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
  },
  gap: {
    paddingVertical: 70,
  },
});

const DataList = ({ data, header, noResultText, fetchMoreOptions, ...props }) => {
  const reload = () => (
    <TouchableOpacity onPress={() => data.refetch()}>
      <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
    </TouchableOpacity >
  );

  const renderHeader = () => {
    const { networkStatus, rows } = data;
    let headerView = null;

    if (networkStatus === 1 && rows.length < 1) {
      headerView = (<View style={styles.gap}><Loading /></View>);
    }

    const parentHeader = typeof header === 'function' ? header() : header;

    return (
      <View>
        {parentHeader}
        {headerView}
      </View>
    );
  };

  const renderFooter = () => {
    const { loading, rows, error, count } = data;
    let footerView = null;

    if (error && !loading) {
      footerView = (
        <View>
          <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
          {reload()}
        </View>
      );
    } else if (count < 1 && !loading) {
      footerView = (
        <View>
          <Text style={styles.errorText}>{noResultText}</Text>
        </View>
      );
    } else if (rows.length >= count) {
      footerView = null;
    } else {
      footerView = (<Loading />);
    }

    return (
      <View style={styles.gap}>
        {footerView}
      </View>
    );
  };

  const loadMore = () => {
    if (data.loading || data.rows.length >= data.count || !fetchMoreOptions) return;
    data.fetchMore(fetchMoreOptions);
  };

  return (
    <FlatList
      {...props}
      data={data.rows}
      keyExtractor={item => item.id}
      refreshing={data.networkStatus === 4 || data.networkStatus === 2}
      onRefresh={() => data.refetch()}
      onEndReachedThreshold={0.8}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReached={loadMore}
    />
  );
};

DataList.propTypes = {
  data: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    fetchMore: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    count: PropTypes.numeric,
    error: PropTypes.object,
    networkStatus: PropTypes.numeric,
  }).isRequired,
  header: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  fetchMoreOptions: PropTypes.shape({
    variables: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
  }),
  noResultText: PropTypes.string,
};

DataList.defaultProps = {
  header: null,
  fetchMoreOptions: {},
  noResultText: 'No result found.',

};

export default DataList;
