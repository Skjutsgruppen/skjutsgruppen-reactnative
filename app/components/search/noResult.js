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
        <Text style={styles.text}>No search results.</Text>
        <Text style={styles.text}>
          Ask for a ride so other participants can find you.
        </Text>
        {renderRoundButton('Ask', 'Ask for a ride')}
      </View>
    );
  }

  if (filters.length === 1 && isFilter(FEED_TYPE_OFFER)) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>
          We did not find any offered rides.
              May we suggest that you press
              &quot;Public Transportation&quot; above and see if
              there are any more ways for you
              to get to {namePlace} ?
        </Text>
      </View>
    );
  }


  if (filters.length === 1 && isFilter(FEED_TYPE_GROUP)) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>There are no groups for this search.</Text>
        <Text style={[styles.text, styles.italic]}>Yet.</Text>
        <Text style={styles.text}>
          If you are interested of a group most likely more people are as well!
          {"Let's"} add a group!
        </Text>
        {renderRoundButton('Group', 'Add a group')}
        <Text onPress={() => navigation.navigate('ExploreGroup')} style={[styles.text, styles.link]}>Or explore existing group.</Text>
      </View>
    );
  }

  if (filters.length === 1 && isFilter(FEED_TYPE_WANTED)) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.text}>No search results.</Text>
        <Text style={styles.text}>
          Offer a ride so other participants can find you.
        </Text>
        {renderRoundButton('Offer', 'Offer a ride')}
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Image source={CycleIcon} />
      <Text style={[styles.text, styles.lightText]}>No search results.</Text>
      {renderRoundButton('Add', 'Add ride')}
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

