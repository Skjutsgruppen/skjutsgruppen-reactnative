import React, { PureComponent } from 'react';
import { Wrapper } from '@components/common';
import { withNotification } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import MesssageItem from '@components/message/item';
import { NOTIFICATION_FETCH_LIMIT } from '@config/constant';
import DataList from '@components/dataList';

class NewNotification extends PureComponent {
  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
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
      />);
  }

  render() {
    const { filters } = this.props;
    return (
      <Wrapper>
        <ToolBar title={`Your ${filters.toUpperCase()} messages`} />
        {this.renderNotification()}
      </Wrapper>
    );
  }
}

NewNotification.propTypes = {
  filters: PropTypes.string.isRequired,
  notifications: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.numeric,
    loading: PropTypes.bool,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const NotificationList = compose(withNotification)(NewNotification);

const SingleNotification = ({ navigation }) => {
  const { filters } = navigation.state.params;
  return (
    <NotificationList
      limit={NOTIFICATION_FETCH_LIMIT}
      filters={filters}
      navigation={navigation}
    />
  );
};

SingleNotification.navigationOptions = {
  header: null,
};

SingleNotification.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default SingleNotification;
