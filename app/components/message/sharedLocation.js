import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@components/utils/texts';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Moment from 'moment';
import ShareLocationItem from '@components/message/shareLocationItem';
import LoadMore from '@components/message/loadMore';
import DataList from '@components/dataList';
import { withLocationSharedToAllResources } from '@services/apollo/notification';
import { updateNotificationSharedLocation } from '@services/apollo/dataSync';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
    paddingVertical: 16,
    backgroundColor: '#f9f4fa',
  },
  sectionTitle: {
    marginTop: 16,
    marginHorizontal: 24,
  },
});

class SharedLocation extends Component {
  componentWillMount() {
    this.loadInterval = setInterval(() => {
      updateNotificationSharedLocation();
    }, 60000);
  }

  componentWillUnmount() {
    if (this.loadInterval) clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  loadMore = (onPress) => {
    const { locationSharedToAllResources } = this.props;
    if (locationSharedToAllResources.loading) return null;

    const remaining = locationSharedToAllResources.count - locationSharedToAllResources.rows.length;
    if (remaining < 1) return null;

    return <LoadMore onPress={onPress} remainingCount={remaining} />;
  }

  isActiveRide = trip => (Moment(trip.date).isAfter());

  renderList = () => {
    const { locationSharedToAllResources } = this.props;

    return (
      <DataList
        data={locationSharedToAllResources}
        renderItem={({ item }) => <ShareLocationItem key={item.id} sharedLocation={item} />}
        infinityScroll={false}
        loadMoreButton={this.loadMore}
        loadMorePosition="bottom"
        fetchMoreOptions={{
          variables: { offset: locationSharedToAllResources.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult ||
              fetchMoreResult.locationSharedToAllResources.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.locationSharedToAllResources.rows.concat(fetchMoreResult.locationSharedToAllResources.rows);

            return {
              locationSharedToAllResources:
                { ...previousResult.locationSharedToAllResources, ...{ rows } },
            };
          },
        }}
      />
    );
  }

  render() {
    const { locationSharedToAllResources } = this.props;

    if (locationSharedToAllResources.loading || locationSharedToAllResources.count < 1) return null;

    return (
      <View style={styles.section}>
        <AppText size={12} color={Colors.text.blue} style={styles.sectionTitle}>
          {(trans('message.sharing_your_location'))}
        </AppText>
        {this.renderList()}
      </View>
    );
  }
}

SharedLocation.propTypes = {
  locationSharedToAllResources: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withLocationSharedToAllResources,
  withNavigation,
  connect(mapStateToProps),
)(SharedLocation);
