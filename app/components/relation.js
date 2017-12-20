import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  participantWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  participant: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#000',
    marginRight: 6,
  },
});

const Relation = ({ users }) => {
  if (!users || users.length < 1) {
    return null;
  }

  if (users.length < 1) {
    return null;
  }

  return (
    <View style={styles.participantWrapper}>
      {users.map((user) => {
        if (user.photo) {
          return (
            <View key={user.id} style={styles.participant}>
              <Image
                source={{ uri: user.photo }}
                style={{ width: 30, height: 30, borderRadius: 30 }}
              />
            </View>
          );
        }
        return <View key={user.id} style={styles.participant} />;
      })}
    </View>
  );
};

Relation.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
};

Relation.defaultProps = {
  users: null,
};

export default Relation;
