import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Loading } from '@components/common';
import { withNotification } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MesssageItem from '@components/message/item';

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
  loadMore = () => {
    const { notification } = this.props;
    if (notification.loading) return null;

    const remaining = notification.count - 5;
    if (remaining < 1) return null;

    return (<Text>and {remaining} more</Text>);
  }

  renderNotification = () => {
    const { notification, navigation } = this.props;

    let render = (<Text>No Message.</Text>);

    if (notification.count > 0) {
      render = notification.rows.map(message => (
        <MesssageItem
          key={message.id}
          navigation={navigation}
          filters={this.props.filters}
          notification={message}
        />
      ));
    }

    if (notification.loading) {
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
  notification: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.numeric,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withNotification)(NewNotification);
