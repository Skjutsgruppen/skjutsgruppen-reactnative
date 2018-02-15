import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';
import { Avatar } from '@components/common';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  lightText: {
    color: Colors.text.gray,
  },
  wrapper: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 10,
  },
  infoWrapper: {
    flex: 1,
    marginHorizontal: 16,
  },
});

const GroupsItem = ({ group, onPress }) => (
  <TouchableHighlight
    onPress={() => onPress('group', group)}
    style={styles.wrapper}
    underlayColor={Colors.background.mutedPink}
  >
    <View style={styles.flexRow}>
      <Avatar imageURI={group.photo || group.mapPhoto} size={46} />
      <View style={styles.infoWrapper}>
        <Text>{group.name}</Text>
        {
          group.outreach === STRETCH_TYPE_AREA &&
          <Text style={styles.lightText}>
            {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
          </Text>
        }

        {
          group.outreach === STRETCH_TYPE_ROUTE &&
          <Text style={styles.lightText}>
            {group.TripStart.name} - {group.TripEnd.name}
          </Text>
        }
      </View>
    </View>
  </TouchableHighlight>
);

GroupsItem.propTypes = {
  group: PropTypes.shape({
    rows: PropTypes.array,
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};


export default GroupsItem;
