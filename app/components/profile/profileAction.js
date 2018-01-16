import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  borderBottom: {
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  blueText: {
    color: Colors.text.blue,
  },
});

const ProfileAction = ({ title, label, icon, onPress }) => (
  <View style={styles.borderBottom}>
    <TouchableOpacity style={styles.action} onPress={onPress}>
      <View>
        {title !== '' && <Text>{title}</Text>}
        <Text style={styles.blueText}>{label}</Text>
      </View>
      {icon && <Image source={icon} />}
    </TouchableOpacity>
  </View>
);

ProfileAction.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string.isRequired,
  icon: PropTypes.number,
  onPress: PropTypes.func,
};

ProfileAction.defaultProps = {
  title: '',
  icon: null,
  onPress: () => { },
};

export default ProfileAction;
