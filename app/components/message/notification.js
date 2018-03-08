import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { withNotification } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MesssageItem from '@components/message/item';
import DataList from '@components/dataList';
import { connect } from 'react-redux';
import { trans } from '@lang/i18n';
import { withNavigation } from 'react-navigation';
import LoadMore from '@components/message/loadMore';

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 16,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  emptyMessage: {
    opacity: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  spacedWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
  },
});

class NewNotification extends PureComponent {
  componentWillMount() {
    const { subscribeToNotification, user, filters, notifications } = this.props;

    if (filters === 'new') {
      subscribeToNotification({ userId: user.id });
      notifications.startPolling(15000);
    }
  }

  loadMore = (onPress) => {
    const { notifications } = this.props;
    if (notifications.loading) return null;

    const remaining = notifications.count - notifications.rows.length;
    if (remaining < 1) return null;

    return <LoadMore onPress={onPress} remainingCount={remaining} />;
  }

  renderNotification = () => {
    const { notifications, filters } = this.props;

    return (
      <DataList
        data={notifications}
        renderItem={({ item }) => (
          <MesssageItem
            key={item.id}
            filters={filters}
            notification={item}
          />
        )}
        infinityScroll={false}
        loadMoreButton={this.loadMore}
        loadMorePosition="bottom"
        fetchMoreOptions={{
          variables: { offset: notifications.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.notifications.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.notifications.rows.concat(
              fetchMoreResult.notifications.rows,
            );

            return { notifications: { ...previousResult.notifications, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    const { notifications, filters } = this.props;

    if (notifications.count < 1) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {filters.toUpperCase()} {filters !== 'new' && trans('message.messages')}
        </Text>
        {this.renderNotification()}
      </View>
    );
  }
}

NewNotification.propTypes = {
  filters: PropTypes.string.isRequired,
  notifications: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.numeric,
    error: PropTypes.object,
  }).isRequired,
  subscribeToNotification: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.numeric,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNotification, withNavigation, connect(mapStateToProps))(NewNotification);
