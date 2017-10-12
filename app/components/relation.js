import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
    backgroundColor: '#000',
    marginRight: 6,
  },
});

const Relation = ({ users }) => (
  <View style={styles.participantWrapper}>
    {users.map((user) => {
      if (user.photo) {
        return (
          <View key={user.id} style={styles.participant}>
            <Image source={{ uri: user.photo }} style={{ width: 20, height: 20, borderRadius: 20 }} />
          </View>
        );
      }

      return <View key={user.id} style={styles.participant} />;
    })}
  </View>
);

export default Relation;
