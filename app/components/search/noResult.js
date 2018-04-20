import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
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

const styles = StyleSheet.create({
  wrapper: {
    padding: '10%',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 32,
    marginVertical: 16,
    textAlign: 'center',
  },
  lightText: {
    color: Colors.text.gray,
  },
  italic: {
    fontStyle: 'italic',
  },
  button: {
    width: '60%',
    paddingHorizontal: 16,
    marginTop: 32,
  },
  link: {
    color: Colors.text.blue,
    fontWeight: '500',
  },
});

const RenderNoResult = ({ filters, renderRoundButton, navigation, namePlace }) => {
  const isFilter = type => filters.indexOf(type) > -1;

  if (filters.length === 2 && isFilter(FEED_TYPE_OFFER) && isFilter(FEED_TYPE_PUBLIC_TRANSPORT)) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>{trans('search.no_search_results')}</Text>
        <Text style={styles.text}>
          {trans('search.ask_for_a_ride_so_other_participants_find_you')}
        </Text>
        {renderRoundButton('Ask', trans('search.ask_for_a_ride'))}
      </View>
    );
  }

  if (filters.length === 1 && isFilter(FEED_TYPE_OFFER)) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>
          {trans('search.did_not_find_any_offered_ride_we_suggest', { namePlace })}
        </Text>
      </View>
    );
  }


  if (filters.length === 1 && isFilter(FEED_TYPE_GROUP)) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>{trans('search.no_groups_for_this_search')}</Text>
        <Text style={[styles.text, styles.italic]}>{trans('search.yet')}</Text>
        <Text style={styles.text}>
          {trans('search.lets_add_a_group')}
        </Text>
        {renderRoundButton('Group', trans('search.add_a_group'))}
        <Text onPress={() => navigation.navigate('ExploreGroup')} style={[styles.text, styles.link]}>{trans('search.or_explore_existing_group')}</Text>
      </View>
    );
  }

  if (filters.length === 1 && isFilter(FEED_TYPE_WANTED)) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>{trans('search.no_search_results')}</Text>
        <Text style={styles.text}>
          {trans('search.offer_a_ride_so_other_participants_can_find_you')}
        </Text>
        {renderRoundButton('Offer', trans('search.offer_a_ride'))}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Image source={CycleIcon} />
      <Text style={[styles.text, styles.lightText]}>{trans('search.no_search_results')}</Text>
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

