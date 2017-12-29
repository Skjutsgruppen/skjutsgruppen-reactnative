import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';

const imageSize = 48;
const margin = 12;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: imageSize,
    marginHorizontal: 16,
    marginVertical: 12,
    alignSelf: 'center',
  },
  profilePic: {
    width: imageSize,
    height: imageSize,
    resizeMode: 'cover',
    borderRadius: imageSize / 2,
    borderWidth: 4,
    borderColor: Colors.border.white,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  remainingCount: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    position: 'absolute',
    top: 0,
    backgroundColor: Colors.background.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.border.white,
  },
  count: {
    fontSize: 14,
    color: Colors.text.white,
  },
});

const Participants = ({ members }) => {
  const { width } = Dimensions.get('window');
  const maxImage = parseInt(((width - 32) / 36), 0);
  let zIndex = maxImage;
  const membersToRender = members.filter((member, index) => index <= maxImage - 1 && member);
  const warpperWidth = members.length > maxImage ? 36 * maxImage : 36 * members.length;

  if (members.length <= maxImage) {
    return (
      <View style={{ justifyContent: 'center', backgroundColor: '#fff' }}>
        <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
          {
            membersToRender.map((member, index) => {
              zIndex -= 1;
              return (
                <Image
                  source={{ uri: member.avatar }}
                  style={[
                    styles.profilePic,
                    index > 0 && { left: (index * imageSize) - (margin * index) },
                    { zIndex },
                  ]}
                  key={member.id}
                />
              );
            })
          }
        </View>
      </View>
    );
  }

  return (
    <View style={{ justifyContent: 'center', backgroundColor: '#fff' }}>
      <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
        {
          membersToRender.map((member, index) => {
            zIndex -= 1;
            if (index < membersToRender.length - 1) {
              return (
                <Image
                  source={require('@assets/profilePic.jpg')}
                  style={[
                    styles.profilePic,
                    index > 0 && { left: (index * imageSize) - (margin * index) },
                    { zIndex },
                  ]}
                  key={member.id}
                />
              );
            }

            return (
              <View
                style={[
                  styles.remainingCount,
                  index > 0 && { left: (index * imageSize) - (margin * index) },
                  { zIndex },
                ]}
                key={member.id}
              >
                <Text style={styles.count}>{(members.length - maxImage) + 1}</Text>
              </View>
            );
          })
        }
      </View>
    </View>
  );
};

Participants.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    avatar: PropTypes.string,
  })).isRequired,
};

export default Participants;
