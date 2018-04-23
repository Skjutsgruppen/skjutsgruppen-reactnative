import React, { Component } from 'react';
import { StyleSheet, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Wrapper, Circle } from '@components/common';
import { Heading } from '@components/utils/texts';
import DiscoverGroupCard from '@components/group/discoverGroupCard';
import { withExploreGroup } from '@services/apollo/group';

import Starter from '@components/add/starter';

import { trans } from '@lang/i18n';
import { Colors } from '@theme';

import AddIcon from '@assets/icons/ic_add.png';
import AddIconActive from '@assets/icons/ic_add_active.png';

const DiscoverGroup = withExploreGroup(DiscoverGroupCard);

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 20,
    marginTop: 84,
    marginBottom: 46,
  },
});

class Add extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: trans('add.add'),
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
      <Wrapper>
        <ScrollView ref={(ref) => { this.scrollView = ref; }} showsVerticalScrollIndicator={false}>
          <Circle />
          <Heading
            size={24}
            color={Colors.text.white}
            fontVariation="bold"
            style={styles.title}
          >
            {trans('add.add')}
          </Heading>
          <Starter
            onPress={() => navigation.navigate('Offer')}
            label={trans('add.offer_a_ride')}
          />
          <Starter
            onPress={() => navigation.navigate('Ask')}
            label={trans('add.ask_a_ride')}
          />
          <Starter
            onPress={() => navigation.navigate('Group')}
            label={trans('add.add_a_group')}
            info={trans('add.for_specific_distance')}
          />
          <DiscoverGroup limit={1} from={null} filter="recent" />
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
