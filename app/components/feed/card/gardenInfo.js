import React from 'react';
import { StyleSheet, View, Platform, Image } from 'react-native';
import { trans } from '@lang/i18n';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { Heading } from '@components/utils/texts';
import { RoundedButton, CostCard } from '@components/common';
import { withNavigation } from 'react-navigation';
import GardenIcon from '@assets/icons/icon_garden.png';

const styles = StyleSheet.create({
  Wrapper: {
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    paddingTop: 24,
  },
  imgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  heading: {
    lineHeight: 34,
    paddingBottom: 16,
  },
  subHeading: {
    marginTop: 15,
    marginBottom: 28,
  },
  suppoterCostCard: {
    paddingHorizontal: 20,
  },
  buttonComponent: {
    justifyContent: 'center',
    paddingTop: 28,
    paddingHorizontal: 86,
    paddingBottom: 48,
  },
});

const navigate = (navigation) => {
  navigation.navigate('SupportReadMore');
};

const Supporter = ({ garden, navigation }) => (
  <View style={styles.Wrapper}>
    <View style={styles.imgWrapper}>
      <Image source={GardenIcon} style={{ height: 100, width: 100, resizeMode: 'contain' }} />
    </View>
    <View>
      <Heading style={[styles.text, styles.heading]} color={Colors.text.yellowGreen} centered >
        {trans('profile.right_now_in_garden')}
      </Heading>
    </View>
    <View style={styles.suppoterCostCard}>
      <CostCard title={trans('profile.server_cost')} coveredPercentage={garden.server} totalCost="2400" />
      <CostCard title={trans('profile.a_programmer')} coveredPercentage={garden.programmer} totalCost="18000" />
      <CostCard title={trans('profile.project_manager')} coveredPercentage={garden.projectManager} totalCost="10000" />
    </View>
    <View style={styles.buttonComponent}>
      <RoundedButton
        style={styles.content}
        bgColor={Colors.background.pink}
        onPress={() => navigate(navigation)}
      >
        {trans('feed.read_more')}
      </RoundedButton>
    </View>
  </View>
);

Supporter.propTypes = {
  garden: PropTypes.shape({
    programmer: PropTypes.number,
    server: PropTypes.number,
    projectManager: PropTypes.number,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Supporter);
