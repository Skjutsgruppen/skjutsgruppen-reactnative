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
    paddingVertical: 50,
  },
  loadMoreBtn: {
    width: 100,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 8,
    marginVertical: 24,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadMoreText: {
    color: Colors.text.darkGray,
    fontSize: 12,
    textAlign: 'center',
  },
});

const DataList = (
  {
    data,
    shouldRefresh,
    header,
    footer,
    noResultText,
    onEndReachedThreshold,
    fetchMoreOptions,
    innerRef,
    infinityScroll,
    ...props
  },
) => {
  const reload = () => (
    <TouchableOpacity onPress={() => data.refetch()}>
      <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
    </TouchableOpacity>
  );

  const loadMoreBtn = () => {
    const { rows, count, loading } = data;

    if (loading || infinityScroll || rows.length >= count) return null;

    return (
      <TouchableOpacity
        onPress={() => data.fetchMore(fetchMoreOptions)}
        style={styles.loadMoreBtn}
      >
        <Text style={styles.loadMoreText}>Load More...</Text>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    const { networkStatus, rows } = data;
    let headerView = null;

    const gap = infinityScroll ? 70 : 18;

    if ((networkStatus === 1 && rows.length < 1) || (!infinityScroll && networkStatus === 3)) {
      headerView = (<View style={{ paddingVertical: gap }}><Loading /></View>);
    }

    const parentHeader = typeof header === 'function' ? header() : header;

    return (
      <View>
        {parentHeader}
        {headerView}
        {loadMoreBtn()}
      </View>
    );
  };

  const shouldRefetch = () => {
    if (!shouldRefresh) {
      return () => { };
    }

    return data.refetch();
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
    } else if (rows.length >= count || !infinityScroll) {
      footerView = null;
    } else {
      footerView = (<Loading />);
    }
    const footerComponent = typeof footer === 'function' ? footer() : footer;

    return (
      <View style={styles.gap}>
        {footerView}
        {footerComponent}
      </View>
    );
  };

  const loadMore = () => {
    if (data.loading || data.rows.length >= data.count || !fetchMoreOptions || !infinityScroll) {
      return;
    }

    data.fetchMore(fetchMoreOptions);
  };

  return (
    <FlatList
      ref={innerRef}
      {...props}
      data={data.rows}
      keyExtractor={item => item.id}
      refreshing={data.networkStatus === 4 || data.networkStatus === 2}
      onRefresh={() => shouldRefetch()}
      onEndReachedThreshold={onEndReachedThreshold}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      onEndReached={loadMore}
      showsVerticalScrollIndicator={false}
    />
  );
};

DataList.propTypes = {
  data: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.object),
    fetchMore: PropTypes.func,
    refetch: PropTypes.func,
    loading: PropTypes.bool,
    count: PropTypes.numeric,
    error: PropTypes.object,
    networkStatus: PropTypes.numeric,
  }).isRequired,
  header: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  footer: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  fetchMoreOptions: PropTypes.shape({
    variables: PropTypes.object.isRequired,
    updateQuery: PropTypes.func.isRequired,
  }),
  noResultText: PropTypes.string,
  innerRef: PropTypes.func,
  shouldRefresh: PropTypes.bool,
  onEndReachedThreshold: PropTypes.number,
  infinityScroll: PropTypes.bool,
};

DataList.defaultProps = {
  header: null,
  footer: null,
  fetchMoreOptions: {},
  noResultText: 'No result found.',
  innerRef: () => { },
  shouldRefresh: true,
  onEndReachedThreshold: 0.8,
  infinityScroll: true,
};

export default DataList;
