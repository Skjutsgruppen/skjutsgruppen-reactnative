import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { trans } from '@lang/i18n';

import Colors from '@theme/colors';
import { Heading, Title, AppText } from '@components/utils/texts';
import Wrapper from '@components/common/wrapper';
import ToolBar from '@components/utils/toolbar';
import Costs from '@components/garden/costs';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  lightText: {
    color: Colors.text.gray,
    lineHeight: 36,
  },
  spaced: {
    marginTop: 24,
  },
});

class ReadMore extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Wrapper>
        <ToolBar title="Self-sustaining garden" fontVariation="bold" />
        <ScrollView>
          <View style={styles.content}>
            <Heading size={26} color={Colors.text.pink} style={{ lineHeight: 33 }}>
              {trans('profile.how_garden_works')}
            </Heading>
            <Title size={24} fontVariation="semibold" style={[styles.lightText, styles.spaced]}>
              {trans('profile.our_philosophy')}
            </Title>
            <Title size={24} style={styles.lightText}>
              {trans('profile.we_share_the_costs_equally')}
            </Title>
            <Title size={24} style={[styles.lightText, styles.spaced]}>
              {trans('profile.we_phrase_this_philosophy_as')}
            </Title>
            <Title size={24} fontVariation="semibold" style={[styles.lightText, styles.spaced]}>
              {trans('profile.transparency')}
            </Title>
            <Title size={24} style={styles.lightText}>
              {trans('profile.as_an_grant_for_your_support')}
            </Title>
            <AppText style={[styles.spaced, { lineHeight: 26 }]}>
              {trans('profile.the_key_here_is')}
            </AppText>
          </View>
          <Costs />
        </ScrollView>
      </Wrapper>
    );
  }
}

export default ReadMore;

