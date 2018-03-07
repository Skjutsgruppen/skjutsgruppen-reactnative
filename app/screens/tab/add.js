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
    tabBarOnPress: ({ scene, jumpToIndex }) => {
      if (scene.focused) {
        const navigationInRoute = scene.route;
        if (!!navigationInRoute
          && !!navigationInRoute.params
          && !!navigationInRoute.params.scrollToTop) {
          navigationInRoute.params.scrollToTop();
        }
      }
      jumpToIndex(1);
    },
  };

  constructor(props) {
    super(props);
    this.scrollView = null;
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ scrollToTop: this.scrollToTop });
    navigation.addListener('didBlur', e => this.tabEvent(e, 'didBlur'));
  }

  shouldComponentUpdate() {
    return false;
  }

  scrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  tabEvent = (e, type) => {
    if (this.scrollView && type === 'didBlur') {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <ScrollView ref={(ref) => { this.scrollView = ref; }}>
          <Circle />
          <Text style={styles.title}>Add</Text>
          <Starter
            onPress={() => navigation.navigate('Offer')}
            label="Offer a ride"
            info="5 steps"
          />
          <Starter
            onPress={() => navigation.navigate('Ask')}
            label="Ask for a ride"
            info="4 steps"
          />
          <Starter
            onPress={() => navigation.navigate('Group')}
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
