import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

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

const HelpMore = () => (
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
      noBackground
      elevation={0}
      amount="589"
      planId={'589_kr_per_year_garden'}
      info={trans('profile.auto_renewed_every_year', { krona: 589 })}
      isHelpMore
      durationLabel={trans('profile.one_year')}
    />
    <Package
      elevation={20}
      amount="1749"
      planId={'1749_kr_per_year_garden'}
      info={trans('profile.auto_renewed_every_year', { krona: 1749 })}
      isHelpMore
      durationLabel={trans('profile.one_year')}
    />
    <Package
      elevation={21}
      amount="2995"
      planId={'2995_kr_per_six_months_garden'}
      info={trans('profile.auto_renewed_every_six_month', { krona: 2995 })}
      isHelpMore
      durationLabel={trans('profile.six_months')}
    />
  </View>
);

export default HelpMore;
