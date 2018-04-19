import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import { AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';
import { Colors } from '@theme';
import { withResetMute } from '@services/apollo/mute';
import { getDate } from '@config';

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
  muteWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  muteCountWrapper: {
    height: 32,
    minWidth: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    paddingHorizontal: 4,
  },
  whiteText: {
    color: Colors.text.white,
    fontSize: 14,
  },
});

const renderPic = (photo) => {
  let profileImage = null;

  if (photo) {
    profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
  }

  return profileImage;
};

const ActiveGroupItem = ({ group, navigation, resetMute }) => {
  const navigateToGroupDetail = async () => {
    if (group.muted) {
      await resetMute({ mutable: 'Group', mutableId: group.id, from: getDate().format() });
    }
    navigation.navigate('GroupDetail', { group });
  };

  return (
    <TouchableHighlight onPress={navigateToGroupDetail} key={group.id}>
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {group.photo ? renderPic(group.photo) : renderPic(group.mapPhoto)}
          </View>
          <View>
            <AppText>{group.name}</AppText>
          </View>
          {
            group.muted &&
            (<View style={styles.muteWrapper}>
              <Image source={require('@assets/icons/ic_mute.png')} />
              {
                group.unreadNotificationCount > 0 &&
                <View style={styles.muteCountWrapper}>
                  <AppText
                    size={14}
                    color={Colors.text.white}
                  >
                    {group.unreadNotificationCount}
                  </AppText>
                </View>
              }
            </View>)
          }
        </View>
      </View>
    </TouchableHighlight>
  );
};

ActiveGroupItem.propTypes = {
  group: PropTypes.shape().isRequired,
  resetMute: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withResetMute, withNavigation)(ActiveGroupItem);
