import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Wrapper, Loading, NavBar } from '@components/common';
import { withNotification } from '@services/apollo/notification';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MesssageItem from '@components/message/item';
import { PER_FETCH_LIMIT } from '@config/constant';

const styles = StyleSheet.create({
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    paddingVertical: 12,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  messages: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  spacedWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  footer: {
    marginVertical: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0CE',
  },
});

class NewNotification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({ loading: false });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderFooter = () => {
    const { loading, rows, count } = this.props.notifications;

    if (rows.length >= count) {
      return (
        <View
          style={styles.footer}
        />
      );
    }

    if (!loading) return null;

    return (
      <View
        style={styles.spacedWrapper}
      >
        <Loading />
      </View>
    );
  };

  renderNotification = () => {
    const { notifications, navigation, filters } = this.props;

    if (notifications.count > 0) {
      return (<FlatList
        data={notifications.rows}
        renderItem={
          ({ item }) => (<MesssageItem
            key={item.id}
            navigation={navigation}
            filters={filters}
            notification={item}
          />)
        }
        keyExtractor={(item, index) => index}
        refreshing={notifications.networkStatus === 4}
        onRefresh={() => notifications.refetch()}
        onEndReachedThreshold={0.8}
        ListFooterComponent={this.renderFooter}
        onEndReached={() => {
          this.setState({ loading: true });
          if (notifications.loading || this.state.loading) return;

          notifications.fetchMore({
            variables: { offset: notifications.rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              this.setState({ loading: false });
              if (!fetchMoreResult || fetchMoreResult.notifications.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.notifications.rows.concat(
                fetchMoreResult.notifications.rows,
              );

              return { notifications: { ...previousResult.notifications, ...{ rows } } };
            },
          });
        }}
      />);
    }

    if (notifications.loading) {
      return (
        <View
          style={styles.spacedWrapper}
        >
          <Loading />
        </View>
      );
    }

    if (!notifications.rows || notifications.rows.length < 1) {
      return (
        <View
          style={styles.spacedWrapper}
        >
          <Text>No Message.</Text>
        </View>
      );
    }

    return null;
  }

  render() {
    const { filters } = this.props;
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.messages}>
          <Text style={styles.sectionTitle}>
            {filters.toUpperCase()} MESSAGES
          </Text>
          {this.renderNotification()}
        </View>
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
  return (<NotificationList limit={PER_FETCH_LIMIT} filters={filters} navigation={navigation} />);
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
