import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Linking, TouchableOpacity } from 'react-native';
import { trans } from '@lang/i18n';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import Colors from '@theme/colors';
import { Heading, Title, AppText } from '@components/utils/texts';
import Wrapper from '@components/common/wrapper';
import ToolBar from '@components/utils/toolbar';
import { RoundedButton } from '@components/common';
import BreakdownCostCard from '@components/garden/breakdownCostCard';
import { withGardenInfo } from '@services/apollo/support';


const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.background.fullWhite,
  },
  philosohpyWrapper: {
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 20,
  },
  nonProfitWrapper: {
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 70,
    backgroundColor: Colors.background.lightBlueWhite,
  },
  breakdownWrapper: {
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  lightText: {
    color: Colors.text.gray,
    lineHeight: 36,
  },
  spaced: {
    marginTop: 24,
  },
  divider: {
    width: 64,
    height: 1,
    backgroundColor: Colors.background.lightGray,
  },
  server: {
    marginBottom: 20,
  },
  programming: {
    marginBottom: 30,
  },
  projectManager: {
    marginBottom: 30,
  },
  fees: {
    marginBottom: 10,
  },
  applePercent: {
    marginVertical: 34,
  },
  horizontalDivider: {
    marginVertical: 32,
    height: 1,
    backgroundColor: Colors.text.lightGray,
  },
  movementButton: {
    width: 200,
  },
});

class ReadMore extends Component {
  static navigationOptions = {
    header: null,
  };

  openLink = (link) => {
    Linking.canOpenURL(link).then((supported) => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.warn('Cannot open given URL.');
      }
    });
  };

  render() {
    const { gardenInfo } = this.props;
    return (
      <Wrapper>
        <ToolBar title="Self-sustaining garden" fontVariation="bold" />
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.philosohpyWrapper}>
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
            </View>
            <View style={[styles.spaced, styles.nonProfitWrapper]}>
              <Title fontVariation="bold" color={Colors.text.pink}>
                {trans('profile.the_non_profit_association')}
              </Title>
              <AppText style={[styles.spaced, { lineHeight: 28 }]} color={Colors.text.darkerGray}>
                {trans('profile.as_an_grant_for_your_support')}
              </AppText>
              <AppText style={[styles.spaced, { lineHeight: 28 }]}>
                {trans('profile.the_key_here')}
              </AppText>
              <AppText style={[styles.spaced, { lineHeight: 28, marginBottom: 20 }]}>
                {trans('profile.but_we_dont_stop_there')}
              </AppText>
              <RoundedButton
                bgColor={Colors.background.pink}
                onPress={() => this.openLink('https://docs.google.com/document/d/1WZECcrD_Qw9dYoLA-uSr8cxCluRjtNKP0gzVXFaxieg/edit?usp=sharing')}
                style={[styles.spaced, styles.movementButton]}
              >
                {trans('profile.our_movement')}
              </RoundedButton>
            </View>
            <View style={styles.breakdownWrapper}>
              <View>
                <AppText size={24} fontVariation="bold" color={Colors.text.darkGray} style={{ marginBottom: 6 }}>
                  {trans('profile.breakdown')}
                </AppText>
                <AppText size={24} color={Colors.text.gray} style={{ lineHeight: 36 }}>
                  {trans('profile.of_all_cost')}
                </AppText>
              </View>
              <View style={[styles.divider, { marginVertical: 40 }]} />
              <View style={styles.server}>
                <BreakdownCostCard title={trans('profile.server_domain_more')} coveredPercentage={gardenInfo.data.server} totalCost="19 299" />
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 20 }}>
                  {trans('profile.why_need_this')}
                </Title>
                <AppText size={16} style={{ lineHeight: 28 }}>
                  {trans('profile.server_need_description')}
                </AppText>
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 24 }}>
                  {trans('profile.breakdown')}
                </Title>
                <AppText size={16} style={{ marginBottom: 6 }}>
                  {trans('profile.server_one_year_cost')}
                </AppText>
                <AppText size={16} style={{ marginBottom: 6 }}>
                  {trans('profile.domain_one_year_cost')}
                </AppText>
                <AppText size={16} style={{ marginBottom: 6 }}>
                  {trans('profile.apple_developer_year_cost')}
                </AppText>
                <AppText size={16} style={{ marginBottom: 34 }}>
                  {trans('profile.send_grid_year_cost')}
                </AppText>
                <AppText>
                  <AppText fontVariation="bold" >{trans('profile.total')} : </AppText>19 299 SEK /{trans('profile.year')}
                </AppText>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />
              <View style={styles.programming}>
                <BreakdownCostCard title={trans('profile.a_programmer')} coveredPercentage={gardenInfo.data.programmer} totalCost="100 000" />
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 20 }}>
                  {trans('profile.why_need_this')}
                </Title>
                <AppText size={16} style={{ lineHeight: 28 }}>
                  {trans('profile.programming_need_description')}
                </AppText>
                <TouchableOpacity onPress={() => this.openLink('https://github.com/Skjutsgruppen')}>
                  <View>
                    <AppText color={Colors.text.blue} style={{ marginTop: 6, marginBottom: 28 }}>
                    github.com/skjutsgruppen
                    </AppText>
                  </View>
                </TouchableOpacity>
                <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                  {trans('profile.pragramming_need_manager_description')}
                </AppText>
                <AppText>
                  <AppText fontVariation="bold" >{trans('profile.total')}: </AppText>100 000 SEK /{trans('profile.year')}
                </AppText>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />
              <View style={styles.projectManager}>
                <BreakdownCostCard title={trans('profile.project_manager')} coveredPercentage={gardenInfo.data.projectManager} totalCost="430 000" />
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 20 }}>
                  {trans('profile.why_need_this')}
                </Title>
                <AppText size={16} style={{ lineHeight: 28 }}>
                  {trans('profile.project_manager_need_description')}
                </AppText>
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 30 }}>
                  {trans('profile.breakdown')}
                </Title>
                <AppText size={16} style={{ marginBottom: 4 }}>
                  {trans('profile.pm_salary_monthly')}
                </AppText>
                <AppText size={16} style={{ lineHeight: 26, marginBottom: 6 }}>
                  {trans('profile.pm_other_costs_monthly')}
                </AppText>
                <AppText size={16} style={{ marginBottom: 30 }}>
                  {trans('profile.pm_vacation_cost')}
                </AppText>
                <AppText style={{ lineHeight: 28 }}>
                  <AppText fontVariation="bold" >{trans('profile.total')}: </AppText>{trans('profile.pm_total_cost')}
                </AppText>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />
              <View style={styles.fees}>
                <Title size={24} fontVariation="bold" color={Colors.text.pink} style={{ marginTop: 10, marginBottom: 30 }}>
                  {trans('profile.fees')}
                </Title>
                <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                  {trans('profile.fees_description_1')}
                </AppText>
                <AppText style={{ lineHeight: 28 }}>
                  {trans('profile.fees_description_2')}
                </AppText>
                <View style={styles.applePercent}>
                  <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6 }}>
                    {trans('profile.percent_to_apple')}
                  </Title>
                  <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                    {trans('profile.apple_fees')}
                  </AppText>
                  <AppText style={{ lineHeight: 28 }}>
                    {trans('profile.amount_after_fees')}
                  </AppText>
                </View>
                <View>
                  <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6 }}>
                    {trans('profile.percent_to_google')}
                  </Title>
                  <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                    {trans('profile.google_fees')}
                  </AppText>
                  <AppText style={{ lineHeight: 28 }}>
                    {trans('profile.amount_after_fees')}
                  </AppText>
                </View>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />

              <View>
                <Title size={24} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 30, marginTop: 10 }}>
                  {trans('profile.excess_money')}
                </Title>
                <AppText size={16} style={{ lineHeight: 28, marginBottom: 18 }}>
                  {trans('profile.excess_money_description')}
                </AppText>
                <RoundedButton
                  bgColor={Colors.background.pink}
                  onPress={() => this.openLink('https://docs.google.com/document/d/1WZECcrD_Qw9dYoLA-uSr8cxCluRjtNKP0gzVXFaxieg/edit?usp=sharing')}
                  style={[styles.spaced, styles.movementButton]}
                >
                  {trans('profile.our_movement')}
                </RoundedButton>
              </View>
            </View>
          </View>
        </ScrollView>
      </Wrapper>
    );
  }
}

ReadMore.propTypes = {
  gardenInfo: PropTypes.shape({
    data: PropTypes.shape({
      server: PropTypes.number,
      programmer: PropTypes.number,
      projectManager: PropTypes.number,
    }),
  }).isRequired,
};

ReadMore.defaultProps = {
  gardenInfo: {
    data: {
      server: 0,
      programmer: 0,
      projectManager: 0,
    },
  },
};

export default compose(withGardenInfo, withNavigation)(ReadMore);
