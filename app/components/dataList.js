import React, { PureComponent } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Loading } from '@components/common';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

const styles = StyleSheet.create({
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
  },
  loadMoreBtnWrapper: {
    width: 100,
    height: 60,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  loadMoreBtn: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
  loadMoreText: {
    color: Colors.text.darkGray,
    fontSize: 12,
    textAlign: 'center',
  },
});

const AnimatedFlatlist = Animated.createAnimatedComponent(
  FlatList,
);

class DataList extends PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ animatedValue: this.animatedValue });
  }

  reload = () => {
    const { data } = this.props;
    return (
      <TouchableOpacity onPress={() => data.refetch()}>
        <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
      </TouchableOpacity>
    );
  };

  loadMoreBtn = () => {
    const { data, infinityScroll, fetchMoreOptions, loadMoreButton } = this.props;
    const { rows, count, loading } = data;

    if (loading || infinityScroll || rows.length >= count) return null;

    if (loadMoreButton) {
      return loadMoreButton(() => data.fetchMore(fetchMoreOptions));
    }

    return (
      <View style={styles.loadMoreBtnWrapper}>
        <TouchableOpacity
          onPress={() => data.fetchMore(fetchMoreOptions)}
          style={styles.loadMoreBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.loadMoreText}>Load more...</Text>
        </TouchableOpacity>
      </View>
    );
  };

  loadMore = () => {
    const { data, infinityScroll, fetchMoreOptions } = this.props;
    if (data.loading || data.rows.length >= data.count || !fetchMoreOptions || !infinityScroll) {
      return;
    }

    data.fetchMore(fetchMoreOptions);
  };

  shouldRefetch = () => {
    const { data, shouldRefresh } = this.props;
    if (!shouldRefresh) {
      return () => { };
    }

    return data.refetch();
  };

  renderHeader = () => {
    const { data, infinityScroll, header, loadMorePosition } = this.props;
    const { networkStatus, rows } = data;
    let headerView = null;

    if ((networkStatus === 1 && rows.length < 1) || (!infinityScroll && loadMorePosition === 'top' && networkStatus === 3)) {
      headerView = (<Loading style={{ height: 60 }} />);
    }

    const parentHeader = typeof header === 'function' ? header() : header;

    return (
      <View>
        {parentHeader}
        {headerView}
        {loadMorePosition === 'top' && this.loadMoreBtn()}
      </View>
    );
  };

  renderFooter = () => {
    const { data, noResultText, infinityScroll, footer, loadMorePosition } = this.props;
    const { networkStatus, loading, rows, error, count } = data;
    let footerView = null;

    if (error && !loading) {
      footerView = (
        <View>
          <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
          {this.reload()}
        </View>
      );
    } else if (count < 1 && !loading) {
      footerView = (
        <View style={{ marginTop: 24, marginBottom: 48 }}>
          <Text style={styles.errorText}>{noResultText}</Text>
        </View>
      );
    } else if (rows.length >= count || (!infinityScroll && loadMorePosition === 'top')) {
      footerView = null;
    } else if (loading || (networkStatus === 1 && rows.length < 1)) {
      footerView = (<Loading style={{ height: 80 }} />);
    }
    const footerComponent = typeof footer === 'function' ? this.footer() : footer;

    return (
      <View style={infinityScroll && { paddingVertical: 50 }}>
        {footerView}
        {footerComponent}
        {loadMorePosition === 'bottom' && this.loadMoreBtn()}
      </View>
    );
  };

  render() {
    const {
      data,
      innerRef,
      onEndReachedThreshold,
      shouldUpdateAnimatedValue,
    } = this.props;
    return (
      <AnimatedFlatlist
        {...this.props}
        ref={innerRef}
        data={data.rows}
        keyExtractor={item => item.id}
        refreshing={data.networkStatus === 4 || data.networkStatus === 2}
        onRefresh={() => this.shouldRefetch()}
        onEndReachedThreshold={onEndReachedThreshold}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        onEndReached={this.loadMore}
        showsVerticalScrollIndicator={false}
        onScroll={
          shouldUpdateAnimatedValue ?
            Animated.event([{ nativeEvent: { contentOffset: { y: this.animatedValue } } }])
            : null
        }
      />
    );
  }
}

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
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
  }).isRequired,
  shouldUpdateAnimatedValue: PropTypes.bool,
  loadMorePosition: PropTypes.string,
  loadMoreButton: PropTypes.func,
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
  shouldUpdateAnimatedValue: false,
  loadMoreButton: null,
  loadMorePosition: 'top',
};

export default withNavigation(DataList);
