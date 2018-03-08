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
    const { data, infinityScroll, fetchMoreOptions } = this.props;
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
    const { data, infinityScroll, header } = this.props;
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
        {this.loadMoreBtn()}
      </View>
    );
  };

  renderFooter = () => {
    const { data, noResultText, infinityScroll, footer } = this.props;
    const { loading, rows, error, count } = data;
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
        <View>
          <Text style={styles.errorText}>{noResultText}</Text>
        </View>
      );
    } else if (rows.length >= count || !infinityScroll) {
      footerView = null;
    } else {
      footerView = (<Loading />);
    }
    const footerComponent = typeof footer === 'function' ? this.footer() : footer;

    return (
      <View style={styles.gap}>
        {footerView}
        {footerComponent}
      </View>
    );
  };

  render() {
    const { data, innerRef, onEndReachedThreshold, shouldUpdateAnimatedValue } = this.props;
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
};

export default withNavigation(DataList);
