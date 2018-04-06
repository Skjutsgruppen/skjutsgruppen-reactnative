import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';
import { Avatar } from '@components/common';
import { Colors } from '@theme';
import { UcFirst } from '@config';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  lightText: {
    color: Colors.text.gray,
  },
  wrapper: {
    backgroundColor: 'transparent',
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
    <View>
      <View style={styles.flexRow}>
        <Avatar imageURI={group.photo || group.mapPhoto} size={46} />
        <View style={styles.infoWrapper}>
          <AppText>{group.name}</AppText>
          {
            group.outreach === STRETCH_TYPE_AREA &&
            <AppText color={Colors.text.gray} style={styles.lightText}>
              {[group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
            </AppText>
          }

          {
            group.outreach === STRETCH_TYPE_ROUTE &&
            <AppText color={Colors.text.gray}>
              {group.TripStart.name
                || UcFirst(group.direction)} - {group.TripEnd.name
                  || UcFirst(group.direction)}
            </AppText>
          }
        </View>
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
