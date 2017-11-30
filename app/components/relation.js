import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  participantWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderBottomWidth: 1,
    borderColor: '#dddee3',
    marginBottom: 10,
  },
  participant: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    marginRight: 6,
  },
});

const Relation = ({ users }) => {
  if (!users) {
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
                style={{ width: 20, height: 20, borderRadius: 20 }}
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
