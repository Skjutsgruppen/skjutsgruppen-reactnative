import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View, Text } from 'react-native';
import PlaceHolder from '@assets/profilePic.jpg';
import Colors from '@theme/colors';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  participantWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  remainingBubbleCount: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.blue,
  },
  remainingCount: {
    color: Colors.text.white,
    fontSize: 12,
  },
});

const RelationBubbleList = ({ users, avatarSize, style, setModalVisibility }) => {
  const userBubbleLength = 3;

  return (
    <TouchableOpacity
      onPress={() => setModalVisibility(true, users)}
      style={[styles.participantWrapper, { marginVertical: avatarSize / 3 }, style]}
    >
      {users.map((user, index) => {
        if (index > (userBubbleLength - 1)) return null;
        let image = null;

        if (user.avatar) {
          image = (<Image
            source={{ uri: user.avatar }}
            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
          />);
        } else {
          image = (<Image
            source={PlaceHolder}
            style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
          />);
        }

        return [
          image,
          ((index + 1) !== users.length) && <Image
            source={require('@assets/icons/icon_arrow_fat.png')}
            style={[styles.arrow, { height: avatarSize / 4, width: avatarSize / 4 }]}
          />,
        ];
      })}
      {(users.length > userBubbleLength) &&
        (
          <View
            style={
              [
                styles.remainingBubbleCount,
                { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
              ]
            }
          >
            <Text style={styles.remainingCount}>+{users.length - userBubbleLength}</Text>
          </View>
        )
      }
    </TouchableOpacity>
  );
};

RelationBubbleList.propTypes = {
  avatarSize: PropTypes.number.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape()),
  style: PropTypes.shape().isRequired,
};

RelationBubbleList.defaultProps = {
  users: [],
};

export default RelationBubbleList;
