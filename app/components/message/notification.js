import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Loading } from '@components/common';
import { withNotification } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MesssageItem from '@components/message/item';
import { connect } from 'react-redux';
import { PER_FETCH_LIMIT } from '@config/constant';

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
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
  more: {
    height: 24,
    alignSelf: 'center',
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  moreText: {
    fontSize: 12,
    color: '#333',
  },
});

class NewNotification extends PureComponent {
  componentWillMount() {
    const { subscribeToNotification, user, filters } = this.props;
    if (filters === 'new') {
      subscribeToNotification({ userId: user.id });
    }
  }

  loadMore = () => {
    const { notifications } = this.props;
    if (notifications.loading) return null;

    const remaining = notifications.count - PER_FETCH_LIMIT;
    if (remaining < 1) return null;

    return (
      <TouchableOpacity onPress={this.moreNotification} style={styles.more}>
        <Text style={styles.moreText}>and {remaining} more</Text>
      </TouchableOpacity>
    );
  }

  moreNotification = () => {
    const { navigation, filters } = this.props;
    navigation.navigate('SingleNotification', { filters });
  }

  renderNotification = () => {
    const { notifications, navigation, filters } = this.props;

    let render = (<Text style={styles.emptyMessage}>No Messages</Text>);
    let limitedNotifications = notifications.rows;

    if (limitedNotifications.length > PER_FETCH_LIMIT) {
      limitedNotifications = limitedNotifications.slice(0, PER_FETCH_LIMIT);
    }

    if (notifications.count > 0) {
      render = limitedNotifications.map(message => (
        <MesssageItem
          key={message.id}
          navigation={navigation}
          filters={filters}
          notification={message}
        />
      ));
    }

    if (notifications.error) {
      render = (
        <View style={{ marginTop: 100 }}>
          <Text>Error: {notifications.error.message}</Text>
          <TouchableOpacity onPress={() => notifications.refetch()}>
            <Text>Reload</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (notifications.loading) {
      render = (
        <View style={styles.spacedWrapper}>
          <Loading />
        </View>
      );
    }

    return render;
  }

  render() {
    const { filters } = this.props;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {filters.toUpperCase()} MESSAGES
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

export default compose(withNotification, connect(mapStateToProps))(NewNotification);
