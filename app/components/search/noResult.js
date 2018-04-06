import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import CycleIcon from '@assets/icons/ic_cycle.png';
import {
  FEED_TYPE_OFFER,
  FEED_TYPE_PUBLIC_TRANSPORT,
  FEED_TYPE_GROUP,
  FEED_TYPE_WANTED,
} from '@config/constant';
import { withNavigation } from 'react-navigation';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    padding: '10%',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    lineHeight: 32,
    marginVertical: 16,
    textAlign: 'center',
  },
  button: {
    width: '60%',
    paddingHorizontal: 16,
    marginTop: 32,
  },
});

const RenderNoResult = ({ filters, renderRoundButton, navigation, namePlace }) => {
  const isFilter = type => filters.indexOf(type) > -1;

  if (filters.length === 2 && isFilter(FEED_TYPE_OFFER) && isFilter(FEED_TYPE_PUBLIC_TRANSPORT)) {
    return (
      <View style={styles.wrapper}>
        <AppText style={styles.text}>{trans('search.no_search_results')}</AppText>
        <AppText style={styles.text}>
          {trans('search.ask_for_a_ride_so_other_participants_find_you')}
        </AppText>
        {renderRoundButton('Ask', trans('search.ask_for_a_ride'))}
      </View>
    );
  }

  if (filters.length === 1 && isFilter(FEED_TYPE_OFFER)) {
    return (
      <View style={styles.wrapper}>
        <AppText style={styles.text}>
          {trans('search.did_not_find_any_offered_ride_we_suggest', { namePlace })}
        </AppText>
      </View>
    );
  }


  if (filters.length === 1 && isFilter(FEED_TYPE_GROUP)) {
    return (
      <View style={styles.wrapper}>
        <AppText style={styles.text}>{trans('search.no_groups_for_this_search')}</AppText>
        <AppText fontVaritaion="italic" style={styles.text}>{trans('search.yet')}</AppText>
        <AppText style={styles.text}>
          {trans('search.lets_add_a_group')}
        </AppText>
        {renderRoundButton('Group', trans('search.add_a_group'))}
        <AppText
          onPress={() => navigation.navigate('ExploreGroup')}
          fontVaritaion="semibold"
          style={styles.text}
          color={Colors.text.blue}
        >{trans('search.or_explore_existing_group')}</AppText>
      </View>
    );
  }

  if (filters.length === 1 && isFilter(FEED_TYPE_WANTED)) {
    return (
      <View style={styles.wrapper}>
        <AppText style={styles.text}>{trans('search.no_search_results')}</AppText>
        <AppText style={styles.text}>
          {trans('search.offer_a_ride_so_other_participants_can_find_you')}
        </AppText>
        {renderRoundButton('Offer', trans('search.offer_a_ride'))}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Image source={CycleIcon} />
      <AppText color={Colors.text.gray} style={styles.text}>{trans('search.no_search_results')}</AppText>
      {renderRoundButton('Add', trans('search.add_ride'))}
    </View>
  );
};

RenderNoResult.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderRoundButton: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  namePlace: PropTypes.string.isRequired,
};

const NoResult = ({ filters, renderRoundButton, navigation, namePlace }) => (
  <ScrollView>
    <RenderNoResult
      filters={filters}
      renderRoundButton={renderRoundButton}
      navigation={navigation}
      namePlace={namePlace}
    />
  </ScrollView>
);

NoResult.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  renderRoundButton: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  namePlace: PropTypes.string.isRequired,
};

export default withNavigation(NoResult);

