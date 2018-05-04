import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { AppText, Title, Heading } from '@components/utils/texts';
import Package from '@components/garden/subscriptionPackage';
import Colors from '@theme/colors';

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

const HelpMore = ({ supportSubscribe }) => (
  <View style={[styles.wrapper, { elevation: 22 }]}>
    <View style={{ paddingBottom: 30, paddingTop: 50, paddingHorizontal: 30 }}>
      <View style={styles.flexRow}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Title size={15} color={Colors.text.blue} style={{ marginBottom: 16 }}>
            HELP US MORE</Title>
          <Heading size={26} color={Colors.text.pink} style={{ lineHeight: 36 }}>
            Show your logo and brand
          </Heading>
        </View>
        <Image source={require('@assets/tiny_card.png')} />
      </View>
      <AppText style={{ marginTop: 24, lineHeight: 26 }}>
        If you’re showing your logo and/or brand
        in this app you have to choose one of the below options.
        The more you support the more you help our non-profit movement.
        Thank you!</AppText>
    </View>
    <Package
      noBackgroud
      elevation={0}
      durationLabel="Support one year"
      monthlyAmount={49}
      planId={3}
      supportSubscribe={supportSubscribe}
      info="Total of 54 kr, auto-renewed every year. Stop when ever you want."
    />
    <Package
      elevation={20}
      durationLabel="Support one year"
      monthlyAmount={149}
      planId={4}
      supportSubscribe={supportSubscribe}
      info="Total of 588 kr, auto-renewed every year. Stop when ever you want."
    />
    <Package
      elevation={21}
      durationLabel="Support one year"
      monthlyAmount={599}
      planId={5}
      supportSubscribe={supportSubscribe}
      info="Total of 7188 kr, auto-renewed every year. Stop when ever you want."
    />
  </View>
);

HelpMore.propTypes = {
  supportSubscribe: PropTypes.func.isRequired,
};

export default HelpMore;
