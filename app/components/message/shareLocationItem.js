import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';

import { Colors } from '@theme';

import { AppText } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';
import Timer from '@components/common/timer';

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
});

const prettify = str => (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());

const renderPic = (photo) => {
  let profileImage = null;

  if (photo) {
    profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
  }

  return profileImage;
};

const ShareLocationItem = ({ sharedLocation, navigation }) => {
  let name = '';
  let avatar = '';
  const resource = sharedLocation.Trip.id ? sharedLocation.Trip : sharedLocation.Group;

  if (sharedLocation.Trip.id) {
    name = `${sharedLocation.Trip.TripStart.name ?
      sharedLocation.Trip.TripStart.name :
      prettify(sharedLocation.Trip.direction)} - ${
      sharedLocation.Trip.TripEnd.name ?
        sharedLocation.Trip.TripEnd.name :
        prettify(sharedLocation.Trip.direction)}`;

    if (name.length > 25) {
      name = `${name.slice(0, 25)} ...`;
    }
    avatar = resource.User.avatar;
  } else {
    name = sharedLocation.Group.name;
    avatar = resource.photo;
  }

  const navigateToTripDetail = async () => {
    if (sharedLocation.Trip.id) {
      navigation.navigate('Route', { info: sharedLocation.Trip });
    } else if (sharedLocation.Group.outreach === 'area') {
      navigation.navigate('Area', { info: sharedLocation.Group });
    } else {
      navigation.navigate('Route', { info: sharedLocation.Group });
    }
  };

  return (
    <TouchableHighlight
      onPress={navigateToTripDetail}
      key={resource.id}
    >
      <View style={styles.list}>
        <View style={styles.flexRow}>
          <View style={styles.profilePicWrapper}>
            {renderPic(avatar)}
          </View>
          <View style={{ flex: 1 }}>
            <AppText numberOfLines={2} ellipsizeMode="tail">{name}</AppText>
            {sharedLocation.Trip.id &&
              <AppText color={Colors.text.gray}>
                Sharing with {sharedLocation.users.length} people
              </AppText>
            }
          </View>
          <View style={styles.muteWrapper}>
            <Timer timeFraction={sharedLocation.timeFraction} duration={sharedLocation.duration} />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

ShareLocationItem.propTypes = {
  sharedLocation: PropTypes.shape().isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withNavigation)(ShareLocationItem);
