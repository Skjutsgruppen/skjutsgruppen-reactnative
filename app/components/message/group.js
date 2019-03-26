import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@components/utils/texts';
import Colors from '@theme/colors';
import { withMyGroups } from '@services/apollo/group';
import { withNotification } from '@services/apollo/notification';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import ActiveGroupItem from '@components/message/ActiveGroupItem';
import LoadMore from '@components/message/loadMore';
import DataList from '@components/dataList';
import { Placeholder } from '@components/common';

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
    paddingVertical: 16,
  },
  sectionTitle: {
    marginHorizontal: 24,
  },
});

class Group extends PureComponent {
  componentWillMount() {
    const { user, subscribeToNewGroup } = this.props;

    if (user.id) {
      subscribeToNewGroup({ userId: user.id });
    }
  }

  loadMore = (onPress) => {
    const { groups } = this.props;
    if (groups.loading) return null;

    const remaining = groups.count - groups.rows.length;
    if (remaining < 1) return null;

    return <LoadMore onPress={onPress} remainingCount={remaining} />;
  }

  renderList = () => {
    const { notifications, groups } = this.props;
    if (notifications.loading) {
      return <Placeholder count={3} wrapperStyle={{ padding: 20 }} />;
    }

    return (
      <DataList
        data={groups}
        renderItem={({ item }) => (item.isBlocked ?
          null :
          <ActiveGroupItem key={item.id} group={item} />)}
        infinityScroll={false}
        loadMoreButton={this.loadMore}
        loadMorePosition="bottom"
        fetchMoreOptions={{
          variables: { offset: groups.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.groups.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.groups.rows.concat(
              fetchMoreResult.groups.rows,
            );

            return { groups: { ...previousResult.groups, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    const { notifications, groups } = this.props;
    if (groups.count < 1 || notifications.count < 1) return null;

    return (
      <View style={styles.section}>
        <AppText size={12} color={Colors.text.blue} style={styles.sectionTitle}>
          {trans('message.your_groups')}
        </AppText>
        {this.renderList()}
      </View>
    );
  }
}

Group.propTypes = {
  groups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  notifications: PropTypes.shape({
    refetch: PropTypes.func.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.numeric,
    error: PropTypes.object,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToNewGroup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withMyGroups, withNotification, withNavigation, connect(mapStateToProps))(Group);
