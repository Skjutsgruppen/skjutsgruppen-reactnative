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

    if (notifications.count > 0) {
      render = notifications.rows.map(message => (
        <MesssageItem
          key={message.id}
          navigation={navigation}
          filters={filters}
          notification={message}
        />
      ));
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
