import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PropTypes } from 'prop-types';
import Avatar from '@components/common/avatar';
import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';

import RemoveIcon from '@assets/icons/ic_cross.png';
import CheckIcon from '@assets/icons/ic_accept.png';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 20,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: Colors.text.blue,
    marginLeft: 10,
    marginRight: 5,
  },
  actionsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  action: {
    flex: 1,
    marginHorizontal: 12,
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  check: {
    color: Colors.text.blue,
    marginLeft: 5,
    marginRight: 10,
  },
});

const MembershipRequestItem = ({ request: { User, id }, onAccept, onReject, position }) => (
  <View style={[styles.container, position === 0 ? { marginTop: 36 } : {}]}>
    <View style={styles.flexRow}>
      <Avatar size={48} imageURI={User.avatar} />
      <Text style={styles.name}>{User.firstName} {User.lastName}</Text>
    </View>
    <View style={styles.actionsWrapper}>
      <TouchableHighlight
        onPress={() => onAccept(id)}
        style={styles.action}
      >
        <View style={styles.actionContent}>
          <Image source={CheckIcon} style={styles.icon} />
          <Text>Let in</Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={() => onReject(id)}
        underlayColor={Colors.background.mutedPink}
        style={styles.action}
      >
        <View style={styles.actionContent}>
          <Image source={RemoveIcon} style={styles.icon} />
          <Text>Reject</Text>
        </View>
      </TouchableHighlight>
    </View>
  </View>
);

MembershipRequestItem.propTypes = {
  request: PropTypes.shape({
    User: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.number.isRequired,
  }).isRequired,
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
};

export default MembershipRequestItem;
