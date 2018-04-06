import React from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ProgressBar } from '@components/common';
import { Colors } from '@theme';
import { trans } from '@lang/i18n';
import { AppText, Heading } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 24,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.text.pink,
    fontSize: 16,
    marginBottom: 6,
  },
  percentage: {
    color: Colors.text.yellowGreen,
  },
});

const CostCard = ({ title, coveredPercentage, totalCost, wrapperStyle }) => (
  <View style={[styles.wrapper, wrapperStyle]}>
    <View style={styles.info}>
      <View>
        <Heading size={16} fontVariation="bold" style={styles.title}>{title}</Heading>
        <AppText size={15}>{`${coveredPercentage}% of ${totalCost} €/${trans('profile.year')}`}</AppText>
      </View>
      <View>
        <Heading
          fontVariation="bold"
          style={[
            styles.percentage,
            coveredPercentage === 0 ? { color: Colors.text.lightGray } : {},
          ]}
        >
          {`${coveredPercentage}%`}
        </Heading>
      </View>
    </View>
    <ProgressBar amount={coveredPercentage} />
  </View >
);

CostCard.propTypes = {
  title: PropTypes.string.isRequired,
  coveredPercentage: PropTypes.number.isRequired,
  totalCost: PropTypes.string.isRequired,
  wrapperStyle: ViewPropTypes.style,
};

CostCard.defaultProps = {
  wrapperStyle: {},
};

export default CostCard;
