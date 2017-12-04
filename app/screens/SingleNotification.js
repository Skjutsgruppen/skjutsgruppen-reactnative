import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Loading, NavBar } from '@components/common';
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
  constructor(props) {
    super(props);
    this.state = ({ loading: false });
  }
  componentWillMount() {
    const { subscribeToNotification, user } = this.props;
    subscribeToNotification({ userId: user.id });
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
          style={{
            paddingVertical: 60,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        />
      );
    }

    if (!loading) return null;

    return (
      <View
        style={{
          paddingVertical: 60,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
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
      return (<Loading />);
    }

    if (!notifications.rows || notifications.rows.length < 1) {
      return (<Text>No Message.</Text>);
    }

    return null;
  }

  render() {
    const { filters } = this.props;
    return (
      <View style={styles.section}>
        <NavBar handleBack={this.goBack} />
        <Text style={styles.sectionTitle}>
          {filters.toUpperCase()} Messages
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
    loading: PropTypes.bool,
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

const NotificationList = compose(withNotification, connect(mapStateToProps))(NewNotification);

const SingleNotification = ({ navigation }) => {
  const { filters } = navigation.state.params;
  return (<NotificationList limit="3" filters={filters} navigation={navigation} />);
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
