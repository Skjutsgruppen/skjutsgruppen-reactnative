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
                The non-profit assocation
              </Title>
              <AppText style={[styles.spaced, { lineHeight: 28 }]} color={Colors.text.darkerGray}>
                As an garant for your support of the movement being handled fair we have a non-profit assocation who is a juridicial person in Sweden.
              </AppText>
              <AppText style={[styles.spaced, { lineHeight: 28 }]}>
                The key here is that this form guarantees transparancy and money will never be missused.
              </AppText>
              <AppText style={[styles.spaced, { lineHeight: 28, marginBottom: 20 }]}>
                But we don’t stop there, we always show you exactly where your support goes, right here in the app. Click “Our movement” to read about the association and the movement, or scroll down to see the costs.
              </AppText>
              <RoundedButton
                bgColor={Colors.background.pink}
                onPress={() => this.openLink('https://docs.google.com/document/d/1WZECcrD_Qw9dYoLA-uSr8cxCluRjtNKP0gzVXFaxieg/edit?usp=sharing')}
                style={[styles.spaced, styles.movementButton]}
              >
                Our movement
              </RoundedButton>
            </View>
            <View style={styles.breakdownWrapper}>
              <View>
                <AppText size={24} fontVariation="bold" color={Colors.text.darkGray} style={{ marginBottom: 6 }}>
                Breakdown
                </AppText>
                <AppText size={24} color={Colors.text.gray} style={{ lineHeight: 36 }}>
                of all the costs and where the money goes
                </AppText>
              </View>
              <View style={[styles.divider, { marginVertical: 40 }]} />
              <View style={styles.server}>
                <BreakdownCostCard title="Server, domains and more" coveredPercentage={gardenInfo.data.server} totalCost="19 299" />
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 20 }}>
                  Why do we need this?
                </Title>
                <AppText size={16} style={{ lineHeight: 28 }}>
                  To run this app we need to have a server. A server is where we store for instance the photos and rides you are publishing.  For people to find the movement we also need domains. A domain is an adress on the internet. Lastly we pay Apple an yearly fee and Sendgrid for sending e-mails.
                </AppText>
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 24 }}>
                  Breakdown
                </Title>
                <AppText size={16} style={{ marginBottom: 6 }}>
                    Server one year - 15 500 SEK
                </AppText>
                <AppText size={16} style={{ marginBottom: 6 }}>
                    Domains one year - 1600 SEK
                </AppText>
                <AppText size={16} style={{ marginBottom: 6 }}>
                  Apple Devoloper fee (yearly) - 999 SEK
                </AppText>
                <AppText size={16} style={{ marginBottom: 34 }}>
                  Sendgrid (yearly) - 1200 SEK
                </AppText>
                <AppText>
                  <AppText fontVariation="bold" >Total: </AppText>19 299 SEK /year
                </AppText>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />
              <View style={styles.programming}>
                <BreakdownCostCard title="Programming" coveredPercentage={gardenInfo.data.programmer} totalCost="100 000" />
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 20 }}>
                  Why do we need this?
                </Title>
                <AppText size={16} style={{ lineHeight: 28 }}>
                  We combine being an open source project where everybody can help out with the programming, with from time to time pay programmers to help us out. We keep issues in the open source project that you can provide to if you want:
                </AppText>
                <TouchableOpacity onPress={() => this.openLink('https://github.com/Skjutsgruppen')}>
                  <View>
                    <AppText color={Colors.text.blue} style={{ marginTop: 6, marginBottom: 28 }}>
                    github.com/skjutsgruppen
                    </AppText>
                  </View>
                </TouchableOpacity>
                <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                  The project manager (see below) manages the smaller issues. On the yearly meeting of the non-profit association we decide on larger issues if needed (like when we decided together to make this app).
                </AppText>
                <AppText>
                  <AppText fontVariation="bold" >Total: </AppText>100 000 SEK /year
                </AppText>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />
              <View style={styles.projectManager}>
                <BreakdownCostCard title="Project Manager" coveredPercentage={gardenInfo.data.projectManager} totalCost="430 000" />
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 20 }}>
                  Why do we need this?
                </Title>
                <AppText size={16} style={{ lineHeight: 28 }}>
                  Having a paid project manager is like having a gardener. The project manager takes care of small to big things surrounding the app, like managing the programming we talked about above, answering e-mails or represent all of our interests when needed. We aim to have a paid project manager half time (20 hours/week).
                </AppText>
                <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6, marginTop: 30 }}>
                  Breakdown
                </Title>
                <AppText size={16} style={{ marginBottom: 6 }}>
                  Saraly - 25 000 SEK /month
                </AppText>
                <AppText size={16} style={{ lineHeight: 28, marginBottom: 6 }}>
                  General payroll tax, staff insurance, pension - 10 000 SEK/month
                </AppText>
                <AppText size={16} style={{ marginBottom: 30 }}>
                  Vacation cost - 7000 SEK/year
                </AppText>
                <AppText style={{ lineHeight: 28 }}>
                  <AppText fontVariation="bold" >Total: </AppText>This amounts to a yearly costs of 427 000 SEK, which we round up to 430 00 SEK since some of the costs may vary (like insurance).
                </AppText>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />
              <View style={styles.fees}>
                <Title size={24} fontVariation="bold" color={Colors.text.pink} style={{ marginTop: 10, marginBottom: 30 }}>
                  Fees
                </Title>
                <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                  There’s a fee on everything we collect here in the self-sustaining garden.
                </AppText>
                <AppText style={{ lineHeight: 28 }}>
                  The bars reflect the money we get after the fees are detracted.
                </AppText>
                <View style={styles.applePercent}>
                  <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6 }}>
                    % to Apple
                  </Title>
                  <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                    Applies if you support through Apple. First year you support us Apple gets 30 %, second year Apple gets 15 %.
                  </AppText>
                  <AppText style={{ lineHeight: 28 }}>
                    This means that if you support 10 kr we get x kr first year and x kr second year you support.
                  </AppText>
                </View>
                <View>
                  <Title size={16} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6 }}>
                  % to Google
                  </Title>
                  <AppText size={16} style={{ lineHeight: 28, marginBottom: 30 }}>
                    Applies if you support through Google. First year you support us Google gets 30 %, second year Google gets 15 %.
                  </AppText>
                  <AppText style={{ lineHeight: 28 }}>
                    This means that if you support 10 kr we get x kr first year and x kr second year you support.
                  </AppText>
                </View>
              </View>
              <View style={[styles.horizontalDivider, { marginBottom: 12 }]} />
              <View style={[styles.horizontalDivider, { marginTop: -4 }]} />

              <View>
                <Title size={24} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 30, marginTop: 10 }}>
                  Excess money
                </Title>
                <AppText size={16} style={{ lineHeight: 28, marginBottom: 18 }}>
                  If and when all the bars are filled up and more money are coming in to the garden the excess money is handled transparantly be the non-profit association. Read more about the association and the movement here:
                </AppText>
                <RoundedButton
                  bgColor={Colors.background.pink}
                  onPress={() => this.openLink('https://docs.google.com/document/d/1WZECcrD_Qw9dYoLA-uSr8cxCluRjtNKP0gzVXFaxieg/edit?usp=sharing')}
                  style={[styles.spaced, styles.movementButton]}
                >
                Our movement
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
