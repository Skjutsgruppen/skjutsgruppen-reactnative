import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1db0ed',
  },
  verticalDevider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
  },
});

const Header = ({ onPressGroup, onPressMap }) => (
  <View style={styles.tab}>
    <View style={{ width: '50%' }}>
      <TouchableOpacity onPress={onPressMap}>
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.tabLabel}>{trans('feed.map')}</Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={styles.verticalDevider} />
    <View style={{ width: '50%' }}>
      <TouchableOpacity onPress={onPressGroup}>
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.tabLabel}>{trans('feed.groups')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

Header.propTypes = {
  onPressGroup: PropTypes.func.isRequired,
  onPressMap: PropTypes.func.isRequired,
};

export default Header;
