import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Wrapper } from '@components/common';
import PropTypes from 'prop-types';

import AddIcon from '@assets/icons/ic_add.png';
import AddIconActive from '@assets/icons/ic_add_active.png';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.text.purple,
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 48,
    marginBottom: 24,
  },
  rowWrapper: {
    backgroundColor: Colors.background.fullWhite,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 12,
  },
  row: {
    borderBottomColor: Colors.border.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  touchable: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  actionLabel: {
    color: Colors.text.blue,
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
    marginTop: 16,
  },
  explore: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.text.green,
    marginTop: 16,
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
  }

  redirectToExploreGroup = () => {
    this.redirect('ExploreGroup');
  }

  render() {
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <ScrollView>
          <Text style={styles.title}>Add</Text>
          <View style={styles.rowWrapper}>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => this.redirect('Offer')}
                style={styles.touchable}
              >
                <Text
                  accessibilityLabel="Go to next form"
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
                  accessibilityLabel="Go to next form"
                  style={styles.actionLabel}
                >
                  Ask for a ride
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => this.redirect('Group')}
                style={styles.touchable}
              >
                <Image source={require('@assets/icons/icon_group.png')} style={styles.groupIcon} />
                <Text
                  accessibilityLabel="Go to next form"
                  style={styles.actionLabel}
                >
                  Add a new group
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.explore}>
            <Image source={require('@assets/icons/icon_telescope.png')} style={styles.telescope} />
            <TouchableOpacity onPress={this.redirectToExploreGroup}>
              <Text style={styles.exploreText}>Explore existing groups</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
