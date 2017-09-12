import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Wrapper } from '@components/common';
import PropTypes from 'prop-types';
import TabIcon from '@components/tabIcon';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    padding: 20,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  actionLabel: {
    color: '#1ca9e5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  explore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-add-outline"
        iconFocused="md-add"
        focused={focused}
        tintColor={tintColor}
      />
    ),
  };

  redirect = (page) => {
    const { navigation } = this.props;
    navigation.navigate(page);
  };

  render() {
    return (
      <Wrapper bgColor="#edec38">
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
              style={styles.touchable}
            >
              <Text
                accessibilityLabel="Go to next form"
                style={styles.actionLabel}
              >
                Ask for a ride again
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => this.redirect('Group')}
              style={styles.touchable}
            >
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
          <View>
            <Text style={styles.exploreText}>
              Want to explore existing groups?
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Click here</Text>
            </TouchableOpacity>
          </View>
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
