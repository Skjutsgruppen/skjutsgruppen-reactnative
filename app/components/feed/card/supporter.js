import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { trans } from '@lang/i18n';
import Avatar from '@components/common/avatar';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { Heading, AppText } from '@components/utils/texts';
import { RoundedButton, CostCard } from '@components/common';
import { withNavigation } from 'react-navigation';

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
  },
  imgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  heading: {
    lineHeight: 34,
    paddingBottom: 16,
    marginTop: 16,
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

const Supporter = ({ garden, user, navigation }) => (
  <View style={styles.Wrapper}>
    <View style={styles.imgWrapper}>
      <Avatar
        imageURI={user.avatar}
        size={60}
        isSupporter
      />
      <Heading style={[styles.text, styles.heading]} color={Colors.text.yellowGreen} centered >
        {user.firstName} {trans('feed.just_supported_our_self_sustaining_garden')}
      </Heading>
      <AppText style={[styles.text, styles.subHeading]} centered>
        {trans('feed.one_of_the_things_we_are_supporting')}
      </AppText>
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
  garden: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    firstName: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Supporter);
