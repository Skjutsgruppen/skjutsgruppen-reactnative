import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import { trans } from '@lang/i18n';
import { RoundedButton, CostCard } from '@components/common';
import { AppText, Title, Heading } from '@components/utils/texts';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
    paddingVertical: 50,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    marginTop: 36,
    width: '100%',
    maxWidth: 200,
    alignSelf: 'center',
  },
  readMore: {
    paddingVertical: 16,
  },
});

const Costs = ({ supporter }) => (
  <View style={styles.wrapper}>
    <Title
      size={15}
      color={Colors.text.blue}
      style={{ marginBottom: 16 }}
    >OUR COSTS</Title>
    <Heading size={26} color={Colors.text.pink} style={{ lineHeight: 36 }}>
      The money goes to:
    </Heading>
    <CostCard title={trans('profile.server_cost')} coveredPercentage={100} totalCost="2400" />
    <CostCard title={trans('profile.a_programmer')} coveredPercentage={50} totalCost="18000" />
    <CostCard title={trans('profile.project_manager')} coveredPercentage={0} totalCost="xxxx" />
    <View style={styles.readMore}>
      {
        !supporter && (
          <AppText style={{ lineHeight: 26 }}>
            We fill up one bar at the time.
            The money is handled transparantly by our non-profit assocation.
            See more about the association and the costs under “Read more”.
          </AppText>
        )
      }
      <RoundedButton
        onPress={() => { }}
        bgColor={Colors.background.pink}
        style={styles.button}
      >
        {trans('profile.read_more')}
      </RoundedButton>
    </View>
  </View>
);

Costs.propTypes = {
  supporter: PropTypes.bool.isRequired,
};

export default Costs;
