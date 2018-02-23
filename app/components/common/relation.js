import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import ProfilePicture from '@components/common/profilePicture';

const styles = StyleSheet.create({
  warpper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  withArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginHorizontal: 2,
  },
});

const Relation = ({ users, size, arrowSize, style }) => (
  <View style={[styles.warpper, style]}>
    {
      users.map((user, index) => (
        <View style={styles.withArrow}>
          <TouchableOpacity>
            <ProfilePicture source={user.source} size={size} />
          </TouchableOpacity>
          {
            ((index + 1) !== users.length) && <Image
              source={require('@assets/icons/icon_arrow_fat.png')}
              style={[styles.arrow, { height: arrowSize, width: arrowSize }]}
            />
          }
        </View>
      ))
    }
  </View>
);

Relation.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.number,
    }),
  ).isRequired,
  size: PropTypes.number.isRequired,
  arrowSize: PropTypes.number,
  style: ViewPropTypes.style,
};

Relation.defaultProps = {
  arrowSize: 12,
  style: {},
};

export default Relation;
