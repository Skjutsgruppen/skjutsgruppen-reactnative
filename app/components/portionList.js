import React, { PureComponent } from 'react';
import { View, SectionList, TouchableOpacity, Text, StyleSheet } from 'react-native';
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

class PortionList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sections: [],
    };
  }

  componentWillMount() {
    const { data } = this.props;
    this.updateSections(data);
  }

  componentWillReceiveProps({ data }) {
    this.updateSections(data);
  }

  updateSections = (data) => {
    const sections = [];

    if (!data.loading || data.rows.length > 1) {
      const sectionObj = data.rows.reduce((r, a) => {
        let year = new Date(a.date);
        year = year.getFullYear();
        r[year] = r[year] || [];
        r[year].push(a);
        return r;
      }, Object.create(null));

      Object.keys(sectionObj).forEach((key) => {
        sections.push({
          title: key,
          data: sectionObj[key],
        });
      });

      sections.sort((a, b) => parseFloat(b.title) - parseFloat(a.title));

      this.setState({ sections });
    }
  }

  reload = () => {
    const { data } = this.props;

    return (
      <TouchableOpacity onPress={() => data.refetch()}>
        <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
      </TouchableOpacity>
    );
  }

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
  }

  shouldRefetch = () => {
    const { shouldRefresh, data } = this.props;

    if (!shouldRefresh) {
      return () => { };
    }

    return data.refetch();
  }

  loadMore = () => {
    const { data, fetchMoreOptions, infinityScroll } = this.props;

    if (data.loading || data.rows.length >= data.count || !fetchMoreOptions || !infinityScroll) {
      return;
    }

    data.fetchMore(fetchMoreOptions);
  }

  renderFooter = () => {
    const { data, noResultText, infinityScroll, listFooter } = this.props;
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
    const footerComponent = typeof listFooter === 'function' ? listFooter() : listFooter;

    return (
      <View style={styles.gap}>
        {footerView}
        {footerComponent}
      </View>
    );
  }

  renderHeader = () => {
    const { data, infinityScroll, listHeader } = this.props;

    const { networkStatus, rows } = data;
    let headerView = null;

    const gap = infinityScroll ? 70 : 18;

    if ((networkStatus === 1 && rows.length < 1) || (!infinityScroll && networkStatus === 3)) {
      headerView = (<View style={{ paddingVertical: gap }}><Loading /></View>);
    }

    const parentHeader = typeof listHeader === 'function' ? listHeader() : listHeader;

    return (
      <View>
        {parentHeader}
        {headerView}
        {this.loadMoreBtn()}
      </View>
    );
  }

  render() {
    const {
      data,
      shouldRefresh,
      listFooter,
      stickySectionHeader,
      sectionHeader,
      sectionFooter,
      onEndReachedThreshold,
      innerRef,
      ...props
    } = this.props;

    const { sections } = this.state;

    return (
      <SectionList
        ref={innerRef}
        {...props}
        sections={sections}
        keyExtractor={(item, index) => index}
        ListHeaderComponent={this.renderHeader}
        renderSectionHeader={sectionHeader}
        renderSectionFooter={sectionFooter}
        stickySectionHeadersEnabled={stickySectionHeader}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={this.renderFooter}
        refreshing={data.networkStatus === 4 || data.networkStatus === 2}
        onRefresh={() => this.shouldRefetch()}
        onEndReached={this.loadMore}
      />
    );
  }
}

PortionList.propTypes = {
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
  stickySectionHeader: PropTypes.bool,
  listFooter: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  listHeader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  sectionFooter: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  sectionHeader: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
};

PortionList.defaultProps = {
  header: null,
  footer: null,
  fetchMoreOptions: {},
  noResultText: 'No result found.',
  innerRef: () => { },
  shouldRefresh: true,
  onEndReachedThreshold: 0.8,
  infinityScroll: true,
  stickySectionHeader: false,
  listHeader: null,
  listFooter: null,
  sectionFooter: null,
  sectionHeader: null,
};

export default PortionList;
