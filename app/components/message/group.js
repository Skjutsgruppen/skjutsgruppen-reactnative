import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import { withMyGroups } from '@services/apollo/group';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import ActiveGroupItem from '@components/message/ActiveGroupItem';
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
  errorText: {
    fontSize: 16,
    lineHeight: 32,
    color: Colors.text.gray,
    textAlign: 'center',
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

class Group extends PureComponent {
  componentWillMount() {
    const { user, subscribeToNewGroup } = this.props;
    if (user.id) {
      subscribeToNewGroup({ userId: user.id });
    }
  }

  loadMore = () => {
    const { groups } = this.props;
    if (groups.loading) return null;

    const remaining = groups.count - PER_FETCH_LIMIT;
    if (remaining < 1) return null;

    return (
      <TouchableOpacity onPress={this.moreGroups} style={styles.more}>
        <Text style={styles.moreText}>{trans('message.and')} {remaining} {trans('message.more')}</Text>
      </TouchableOpacity>
    );
  }

  moreGroups = () => {
    const { navigation } = this.props;

    navigation.navigate('ActiveGroupList');
  }

  render() {
    const { groups } = this.props;

    let render = (<Text style={styles.emptyMessage}>{trans('message.no_group')}</Text>);


    let limitedgroups = groups.rows;

    if (limitedgroups.length > PER_FETCH_LIMIT) {
      limitedgroups = limitedgroups.slice(0, PER_FETCH_LIMIT);
    }

    if (groups.count > 0) {
      render = limitedgroups.map(group => <ActiveGroupItem key={group.id} group={group} />);
    }

    if (groups.error) {
      render = (
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.errorText}>{trans('global.oops_something_went_wrong')}</Text>
          <TouchableOpacity onPress={() => groups.refetch()}>
            <Text style={styles.errorText}>{trans('global.tap_to_retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (groups.loading) {
      render = (
        <View style={styles.spacedWrapper}>
          <Loading />
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {trans('message.your_groups').toUpperCase()}
        </Text>
        {render}
        {this.loadMore()}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToNewGroup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withMyGroups, withNavigation, connect(mapStateToProps))(Group);
