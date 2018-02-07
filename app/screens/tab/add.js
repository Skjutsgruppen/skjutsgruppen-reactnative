import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, Image } from 'react-native';
import { Wrapper, Circle } from '@components/common';
import PropTypes from 'prop-types';

import ExploreRecentGroup from '@components/group/exploreRecentCard';
import { withExploreGroup } from '@services/apollo/group';

import Starter from '@components/add/starter';

import { Colors } from '@theme';

import AddIcon from '@assets/icons/ic_add.png';
import AddIconActive from '@assets/icons/ic_add_active.png';

const ExploreGroupsRecentDetail = withExploreGroup(ExploreRecentGroup);

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.white,
    marginHorizontal: 20,
    marginTop: '15%',
    marginBottom: '5%',
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
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ScrollView>
          <Circle />
          <Text style={styles.title}>Add</Text>
          <Starter
            onPress={() => this.redirect('Offer')}
            label="Offer a ride"
            info="5 steps"
          />
          <Starter
            onPress={() => this.redirect('Ask')}
            label="Ask for a ride"
            info="5 steps"
          />
          <Starter
            onPress={() => this.redirect('Group')}
            label="Add a new group"
            info="For a specific distance. area or subject"
          />
          <ExploreGroupsRecentDetail
            limit={1}
            from={null}
            filter="recent"
            style={{ marginHorizontal: 20, marginTop: 0 }}
          />
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
