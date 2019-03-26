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
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const CostCard = ({ title, coveredPercentage, totalCost, wrapperStyle }) => (
  <View style={[styles.wrapper, wrapperStyle]}>
    <View style={styles.info}>
      <View>
        <Heading size={18} fontVariation="bold" color={Colors.text.pink} style={{ marginBottom: 6 }}>{title}</Heading>
        <Title size={15} color={Colors.text.gray}>{`${coveredPercentage}% of ${totalCost} SEK/${trans('profile.year')}`}</Title>
      </View>
      <View>
        <Heading
          fontVariation="bold"
          style={[
            styles.percentage,
            coveredPercentage === 0 ? { color: Colors.text.lightGray }
              : { color: Colors.text.yellowGreen },
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
