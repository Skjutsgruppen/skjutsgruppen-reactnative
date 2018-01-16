import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { trans } from '@lang/i18n';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  exploreGroup: {
    alignItems: 'center',
    marginVertical: 50,
    marginHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    elevation: 4,
  },
  exploreGroupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 24,
    marginTop: 40,
    textAlign: 'center',
  },
  exploreIcon: {
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: Colors.background.pink,
    alignSelf: 'center',
    margin: 30,
  },
  exploreFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 36,
    backgroundColor: Colors.background.lightBlueWhite,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  newestGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  exploreFooterLabel: {
    color: Colors.text.blue,
    marginBottom: 16,
  },
  totalGroupCount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  groupName: {
    fontSize: 16,
  },
});

class ExploreRecentGroup extends PureComponent {
  redirectToExploreGroup = () => {
    const { navigation } = this.props;
    navigation.navigate('ExploreGroup');
  }

  redirect = () => {
    const { navigation, exploreGroups: { rows } } = this.props;

    navigation.navigate('GroupDetail', { group: rows[0] });
  }

  render() {
    const { exploreGroups: { count, rows, loading } } = this.props;

    if (count === 0) {
      return null;
    }

    if (loading) {
      return (<Loading />);
    }

    const group = rows[0];

    return (
      <View style={styles.exploreGroup}>
        <Text style={styles.exploreGroupTitle}>{trans('search.explore_groups')}</Text>
        <TouchableOpacity onPress={this.redirectToExploreGroup}>
          <View style={styles.exploreIcon} />
        </TouchableOpacity>
        <View style={styles.exploreFooter}>
          <View style={{ width: '60%' }}>
            <Text style={styles.exploreFooterLabel}>{trans('search.newest')}</Text>
            <TouchableOpacity onPress={this.redirect}>
              <View style={styles.newestGroup}>
                <Image source={{ uri: group.User.avatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.groupName}>{group.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: '40%' }}>
            <Text style={styles.exploreFooterLabel}>{trans('search.total_groups')}</Text>
            <Text style={styles.totalGroupCount}>{count}</Text>
          </View>
        </View>
      </View>
    );
  }
}

ExploreRecentGroup.propTypes = {
  exploreGroups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape()),
    loading: PropTypes.bool,
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

ExploreRecentGroup.defaultProps = {
  exploreGroups: {
    rows: [],
    loading: true,
  },
};

export default ExploreRecentGroup;
