import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Loading, Retry } from '@components/common';
import { withNotification } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MesssageItem from '@components/message/item';
import { connect } from 'react-redux';
import { PER_FETCH_LIMIT } from '@config/constant';
import { trans } from '@lang/i18n';
import { withNavigation } from 'react-navigation';
import LoadeMore from '@components/message/loadMore';

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

  loadMore = () => {
    const { notifications } = this.props;
    if (notifications.loading) return null;

    const remaining = notifications.count - PER_FETCH_LIMIT;
    if (remaining < 1) return null;

    return <LoadeMore onPress={this.moreNotification} remainingCount={remaining} />;
  }

  moreNotification = () => {
    const { navigation, filters } = this.props;
    navigation.navigate('SingleNotification', { filters });
  }

  renderNotification = () => {
    const { notifications, filters } = this.props;

    let render = (<Text style={styles.emptyMessage}>{trans('message.no_message')}</Text>);
    let limitedNotifications = notifications.rows;

    if (limitedNotifications.length > PER_FETCH_LIMIT) {
      limitedNotifications = limitedNotifications.slice(0, PER_FETCH_LIMIT);
    }

    if (notifications.count > 0) {
      render = limitedNotifications.map(message => (
        <MesssageItem
          key={message.id}
          filters={filters}
          notification={message}
        />
      ));
    }

    if (notifications.error) {
      render = <Retry onPress={() => notifications.refetch()} />;
    }

    if (notifications.loading && notifications.row < 1) {
      render = (
        <View style={styles.spacedWrapper}>
          <Loading />
        </View>
      );
    }

    return render;
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
        {this.loadMore()}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  subscribeToNotification: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.numeric,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNotification, withNavigation, connect(mapStateToProps))(NewNotification);
