import React from 'react';
import { StyleSheet, View, Text, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { ProgressBar } from '@components/common';
import { Colors } from '@theme';

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
    fontWeight: 'bold',
    color: Colors.text.pink,
    fontSize: 16,
    marginBottom: 6,
  },
  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.yellowGreen,
  },
});

const CostCard = ({ title, coveredPercentage, totalCost, wrapperStyle }) => (
  <View style={[styles.wrapper, wrapperStyle]}>
    <View style={styles.info}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.cost}>{`${coveredPercentage}% of ${totalCost} €/year`}</Text>
      </View>
      <View>
        <Text
          style={[
            styles.percentage,
            coveredPercentage === 0 ? { color: Colors.text.lightGray } : {},
          ]}
        >
          {`${coveredPercentage}%`}
        </Text>
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
