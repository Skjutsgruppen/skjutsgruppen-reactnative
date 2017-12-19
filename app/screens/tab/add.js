import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Wrapper } from '@components/common';
import PropTypes from 'prop-types';

import AddIcon from '@icons/ic_add.png';
import AddIconActive from '@icons/ic_add_active.png';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  rowWrapper: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 12,
  },
  row: {
    borderBottomColor: '#eee',
    borderBottomWidth: 2,
  },
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  actionLabel: {
    color: '#1ca9e5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupIcon: {
    height: 24,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  telescope: {
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 24,
  },
  explore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,

  },
  exploreText: {
    fontSize: 12,
    textAlign: 'center',
  },
  exploreButton: {
    width: 100,
  },
  exploreButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginLeft: 2,
  },
});

class Add extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Add',
    tabBarIcon: ({ focused }) => <Image source={focused ? AddIconActive : AddIcon} />,
  };

  redirect = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  redirectToOffer = () => {
    this.redirect('Offer');
  }

  redirectToGroup = () => {
    this.redirect('Group');
  }

  redirectToExploreGroup = () => {
    this.redirect('ExploreGroup');
  }

  render() {
    return (
      <Wrapper bgColor="#edec38">
        <Text style={styles.title}>Add</Text>
        <View style={styles.rowWrapper}>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={this.redirectToOffer}
              style={styles.touchable}
            >
              <Text
                style={styles.actionLabel}
              >
                Offer a ride
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => this.redirect('Ask')}
              style={styles.touchable}
            >
              <Text
                style={styles.actionLabel}
              >
                Ask for a ride
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={this.redirectToGroup}
              style={styles.touchable}
            >
              <Image source={require('@icons/icon_group.png')} style={styles.groupIcon} />
              <Text
                accessibilityLabel="Go to next form"
                style={styles.actionLabel}
              >
                Add a new group
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image source={require('@icons/icon_telescope.png')} style={styles.telescope} />
        <View style={styles.explore}>
          <Text style={styles.exploreText}>
            Want to explore existing groups?
          </Text>
          <TouchableOpacity onPress={this.redirectToExploreGroup} style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>Click here</Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
    );
  }
}

Add.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Add;
