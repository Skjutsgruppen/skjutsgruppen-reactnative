import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import TouchableHighlight from '@components/touchableHighlight';

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
    <TouchableHighlight onPress={onPress}>
      <View style={styles.action}>
        <View>
          {title !== '' && <Text>{title}</Text>}
          <Text style={styles.blueText}>{label}</Text>
        </View>
        {icon && <Image source={icon} />}
      </View>
    </TouchableHighlight>
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
