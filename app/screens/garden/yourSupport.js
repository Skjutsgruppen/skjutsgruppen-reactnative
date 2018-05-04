import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import Colors from '@theme/colors';
import { Heading, Title } from '@components/utils/texts';
import Wrapper from '@components/common/wrapper';
import ToolBar from '@components/utils/toolbar';
import Header from '@components/garden/header';
import Package from '@components/garden/subscriptionPackage';
import HelpMore from '@components/garden/helpMore';
import HowItWorks from '@components/garden/howItWorks';
import Costs from '@components/garden/costs';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalDivider: {
    marginVertical: 32,
    height: 1,
    backgroundColor: Colors.text.lightGray,
  },
  text: {
    marginTop: 24,
  },
});

class YourSupport extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const supporter = true;

    return (
      <Wrapper>
        <ToolBar title="Your support" fontVariation="bold" />
        <ScrollView>
          <Header
            showTitle={false}
            showAvatar={false}
            headingLabel="You are a supporter!"
            infoLabel="Your have so far supported:"
          />
          <View style={{ paddingHorizontal: 30, paddingBottom: 30 }}>
            <View style={styles.flexRow}>
              <View>
                <Title color={Colors.text.gray}>
                  <Title color={Colors.text.pink} fontVariation="bold">9 kr </Title>
                  every month
                </Title>
                <Title color={Colors.text.gray}>for six month</Title>
              </View>
              <Heading color={Colors.text.yellowGreen}>54 kr</Heading>
            </View>
            <Title color={Colors.text.gray} style={styles.text}>
              This support is auto renewed every six month.
              Your are in 4 of this support and have not been auto renewed yet.
            </Title>
            <View style={styles.horizontalDivider} />
            <View style={styles.flexRow}>
              <View>
                <Title color={Colors.text.pink} fontVariation="bold">Shoe your logo and brand</Title>
                <Title color={Colors.text.gray}>
                  <Title color={Colors.text.pink}>599 kr </Title>
                  every month
                </Title>
                <Title color={Colors.text.gray}>for one year</Title>
              </View>
              <Heading color={Colors.text.yellowGreen}>7188 kr</Heading>
            </View>
            <Title color={Colors.text.gray} style={styles.text}>
              This support is auto renewed every six month.
              Your are in 14 of this support and have auto renewed one time yet.
            </Title>
            <View style={styles.horizontalDivider} />
            <Heading size={16} color={Colors.text.yellowGreen}>Total</Heading>
            <View style={styles.flexRow}>
              <Title color={Colors.text.gray}>Total supported</Title>
              <Heading size={16} color={Colors.text.yellowGreen}>14430 kr</Heading>
            </View>
            <Title color={Colors.text.gray} fontVariation="italic" style={styles.text}>
              Your total support so far, auto renewals included
            </Title>
            <View style={styles.horizontalDivider} />
            <Title color={Colors.text.pink} fontVariation="bold">Thank you for your support so far!</Title>
            <Title color={Colors.text.gray} style={styles.text}>
              `If you like to continue to support the movement you don't have to do anything,
              your support will be auto-renewed.`
            </Title>
            <Title color={Colors.text.pink} fontVariation="bold" style={styles.text}>And!</Title>
            <Title color={Colors.text.gray} style={styles.text}>
              If you decide not to continue any of the support, which is sad, you can do
              that anytime you feel like to from the support type above.
            </Title>
            <Title color={Colors.text.pink} fontVariation="bold" style={styles.text}>Or would you like to support?</Title>
            <Title color={Colors.text.gray} style={styles.text}>
              Just click one of the buttons below and support more!
            </Title>
          </View>
          <Package
            noBackgroud
            elevation={0}
            durationLabel="Support six month"
            monthlyAmount={9}
            info="Total of 54 kr, auto-renewed every six month. Stop when ever you want."
          />
          <Package
            elevation={20}
            durationLabel="Support one month"
            monthlyAmount={29}
            info="Total of 29 kr, auto-renewed every six month. Stop when ever you want."
          />
          <HelpMore />
          <HowItWorks />
          <Costs supporter={supporter} />
        </ScrollView>
      </Wrapper>
    );
  }
}

export default YourSupport;

