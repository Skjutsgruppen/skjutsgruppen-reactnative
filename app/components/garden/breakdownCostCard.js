import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ProgressBar } from '@components/common';
import { Colors } from '@theme';
import { trans } from '@lang/i18n';
import { Title, Heading } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    paddingBottom: 24,
  },
  // info: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },
  costProgress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});

const BreakdownCostCard = ({ title, coveredPercentage, totalCost, wrapperStyle }) => (
  <View style={[styles.wrapper, wrapperStyle]}>
    <View style={styles.info}>
      <View style={{ marginBottom: 24 }}>
        <Heading size={24} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6 }}>{title}</Heading>
      </View>
      <View style={styles.costProgress}>
        <Title style={{ marginBottom: 16 }} size={16} color={Colors.text.darkGray}>{`${totalCost} SEK /${trans('profile.year')}`}</Title>
        <Heading
          fontVariation="bold"
          style={[styles.percentage, coveredPercentage === 0 ? { color: Colors.text.lightGray }
            : { color: Colors.text.yellowGreen },,
            { marginTop: -2 }]}
        >
          {`${coveredPercentage}%`}
        </Heading>
      </View>
    </View>
    <ProgressBar amount={coveredPercentage} />
  </View>
);

BreakdownCostCard.propTypes = {
  title: PropTypes.string.isRequired,
  coveredPercentage: PropTypes.number.isRequired,
  totalCost: PropTypes.string.isRequired,
  wrapperStyle: ViewPropTypes.style,
};

BreakdownCostCard.defaultProps = {
  wrapperStyle: {},
};

export default BreakdownCostCard;
