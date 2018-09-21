import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { AppText, Title, Heading } from '@components/utils/texts';
import Package from '@components/garden/subscriptionPackage';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background.mutedBlue,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const HelpMore = ({ currentlySupporting }) => (
  <View style={[styles.wrapper, { elevation: 22 }]}>
    <View style={{ paddingBottom: 30, paddingTop: 50, paddingHorizontal: 30 }}>
      <View style={styles.flexRow}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Title size={15} color={Colors.text.blue} style={{ marginBottom: 16 }}>
            {trans('profile.help_us_more')}
          </Title>
          <Heading size={26} color={Colors.text.pink} style={{ lineHeight: 36 }}>
            {trans('profile.show_your_logo_and_brand')}
          </Heading>
        </View>
        <Image source={require('@assets/tiny_card.png')} />
      </View>
      <AppText style={{ marginTop: 24, lineHeight: 26 }}>
        {trans('profile.if_you_are_showing_your_logo')}
      </AppText>
    </View>
    <Package
      noBackgroud
      elevation={0}
      durationLabel={trans('profile.support_one_year')}
      amount="589kr"
      planId={'monthly_subscription_1_test'}
      info={trans('profile.auto_renewed_every_year', { krona: 589 })}
      title="Support a year"
      currentlySupporting={currentlySupporting}
      amountPerMonth={parseFloat(589 / 12).toFixed(2)}
    />
    <Package
      elevation={20}
      durationLabel={trans('profile.support_one_year')}
      amount="1749kr"
      planId={'test1'}
      info={trans('profile.auto_renewed_every_year', { krona: 1749 })}
      title="Support a year"
      currentlySupporting={currentlySupporting}
      amountPerMonth={parseFloat(1749 / 12).toFixed(2)}
    />
    <Package
      elevation={21}
      durationLabel={trans('profile.support_one_year')}
      amount="2995kr"
      planId={'test1'}
      info={trans('profile.auto_renewed_every_six_month', { krona: 2995 })}
      title="Support six month"
      currentlySupporting={currentlySupporting}
      amountPerMonth={parseFloat(2995 / 6).toFixed(2)}
    />
  </View>
);

export default HelpMore;
