import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  profilePicWrapper: {
    flexDirection: 'row',
    marginRight: 16,
  },
  profilePic: {
    width: 46,
    height: 46,
    resizeMode: 'cover',
    borderRadius: 23,
    marginRight: 4,
  },
  chevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});

const renderPic = (photo) => {
  let profileImage = null;

  if (photo) {
    profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
  }

  return profileImage;
};

const ActiveGroupItem = ({ group, navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { group })} key={group.id}>
    <View style={styles.list}>
      <View style={styles.flexRow}>
        <View style={styles.profilePicWrapper}>
          {group.photo ? renderPic(group.photo) : renderPic(group.mapPhoto)}
        </View>
        <View>
          <Text>{group.name}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

ActiveGroupItem.propTypes = {
  group: PropTypes.shape().isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(ActiveGroupItem);
