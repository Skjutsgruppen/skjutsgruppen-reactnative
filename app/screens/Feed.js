import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import feedAction from '@redux/actions/feed';
import FeedService from '@services/Feed';
import PropTypes from 'prop-types';
import FeedList from '@components/feed/feedList';
import { Loading, Error } from '@components/common';

class Feed extends Component {
  componentDidMount() {
    const { getFeed } = this.props;
    getFeed();
  }

  renderFeed() {
    const { items } = this.props.feed;
    if (items.length < 1) {
      return null;
    }

    return <FeedList />;
  }

  render() {
    const { fetching, error } = this.props.feed;

    if (fetching) {
      return (<Loading />);
    }

    if (error) {
      return (<Error />);
    }

    return (
      <ScrollView>
        {this.renderFeed()}
      </ScrollView>
    );
  }
}

Feed.propTypes = {
  feed: PropTypes.shape({
    items: PropTypes.array,
    fetching: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
  getFeed: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ feed: state.feed });

const mapDispatchToProps = dispatch => ({
  getFeed: () => {
    dispatch(feedAction.fetching());

    FeedService.fetch()
      .then(res => dispatch(feedAction.fetched(res)))
      .catch(error => dispatch(feedAction.error({ error: error.message })));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
