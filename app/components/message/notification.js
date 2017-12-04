import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Loading } from '@components/common';
import { withNotification } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MesssageItem from '@components/message/item';
import { connect } from 'react-redux';

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

    const remaining = notifications.count - 5;
    if (remaining < 1) return null;

    return (
      <TouchableOpacity onPress={this.moreNotification}>
        <Text>and {remaining} more</Text>
      </TouchableOpacity>
    );
  }

  moreNotification = () => {
    const { navigation, filters } = this.props;
    navigation.navigate('SingleNotification', { filters });
  }

  renderNotification = () => {
    const { notifications, navigation, filters } = this.props;

    let render = (<Text>No Message.</Text>);

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
      render = (<Loading />);
    }

    return render;
  }

  render() {
    const { filters } = this.props;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {filters.toUpperCase()} Messages
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
