import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  lightText: {
    color: '#777777',
  },
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
  feed: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 6,
    marginLeft: 6,
    marginBottom: 16,
    borderColor: '#cccccc',
    borderBottomWidth: 4,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  feedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  feedImg: {
    width: '100%',
  },
  imgIcon: {
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  stopText: {
    color: '#00000077',
    marginTop: 16,
    marginBottom: 12,
  },
  messageText: {
    marginBottom: 16,
  },
  feedAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 2,
    borderColor: '#dddee3',
  },
  participantWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '33.33%',
    height: 48,
  },
  participant: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginRight: 6,
  },
  verticalDevider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
  },
  newGroupInfoWrapper: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#00000011',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGroupNameWrapper: {
    borderColor: '#ffffff',
    borderBottomWidth: 2,
    marginBottom: 16,
    paddingBottom: 16,
  },
  newGroupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newGroupPlace: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  newGroupInfo: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
  },
});

const Header = () => (
  <View style={styles.tab}>
    <View style={{ width: '50%' }}>
      <TouchableOpacity>
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.tabLabel}>Map</Text>
        </View>
      </TouchableOpacity>
    </View>
    <View style={styles.verticalDevider} />
    <View style={{ width: '50%' }}>
      <TouchableOpacity>
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.tabLabel}>Groups</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

export default Header;
