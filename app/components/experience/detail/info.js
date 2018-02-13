import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { Loading } from '@components/common';
import Date from '@components/date';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { withNavigation } from 'react-navigation';

const imageSize = 48;
const margin = 12;

const styles = StyleSheet.create({
  block: {
    paddingVertical: 12,
  },
  name: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: imageSize,
    marginVertical: 12,
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


const Info = ({ loading, experience, navigation }) => {
  const renderParticipants = () => {
    if (!experience.Participants) {
      return null;
    }

    return experience.Participants.map((row, index) => {
      let separator = ' ';
      if (index === (experience.Participants.length - 2)) {
        separator = ' and ';
      } else if (index < (experience.Participants.length - 1)) {
        separator = ', ';
      }

      return (<Text key={row.User.id}>
        <Text
          onPress={() => navigation.navigate('Profile', { profileId: row.User.id })}
          style={styles.name}
        >
          {row.User.firstName}
        </Text>
        {separator}
      </Text>);
    });
  };


  const renderTripInfo = () => {
    if (!experience.Trip) {
      return null;
    }

    return (
      <Text onPress={() => navigation.navigate('TripDetail', { trip: experience.Trip })}>
        <Text>
          went from {experience.Trip.TripStart.name} to {experience.Trip.TripEnd.name} on <Date format="MMM DD, YYYY">{experience.Trip.date}</Date>
          . <Text style={styles.name}>See their trip here</Text>
        </Text>
      </Text>
    );
  };

  const renderParticipantHeads = () => {
    if (!experience.Participants) {
      return null;
    }

    const participants = experience.Participants;
    const { width } = Dimensions.get('window');
    const maxImage = parseInt(((width - 32) / 36), 0);

    let zIndex = maxImage;
    const membersToRender = participants.filter((member, index) => index <= maxImage - 1 && member);
    const warpperWidth = participants.length > maxImage ? 36 * maxImage : 36 * participants.length;

    return (
      <View style={{ justifyContent: 'center', backgroundColor: '#fff' }}>
        <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
          {
            membersToRender.map(({ User }, index) => {
              zIndex -= 1;

              if (index < (maxImage - 1)) {
                return (
                  <Image
                    key={User.id}
                    source={{ uri: User.avatar }}
                    style={[
                      styles.profilePic,
                      index > 0 && { left: (index * imageSize) - (margin * index) },
                      { zIndex },
                    ]}
                  />
                );
              }

              return (
                <View
                  key={User.id}
                  style={[
                    styles.remainingCount,
                    index > 0 && { left: (index * imageSize) - (margin * index) },
                    { zIndex },
                  ]}
                >
                  <Text style={styles.count}>
                    +{(participants.length + 1) - maxImage}
                  </Text>
                </View>
              );
            })
          }
        </View>
      </View>
    );
  };

  return (
    <View>
      {(loading && !experience.Participants) && <Loading />}
      <View style={styles.block}>
        {renderParticipantHeads()}
      </View>

      <View style={styles.block}>
        <Text>
          {renderParticipants()}
          {renderTripInfo()}
        </Text>
      </View>
      <View style={styles.block}>
        <Text>
          {experience.description}
        </Text>
      </View>

    </View>
  );
};

Info.propTypes = {
  experience: PropTypes.shape({
    Participants: PropTypes.array,
    Trip: PropTypes.object,
    User: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
    }),
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withNavigation(Info);
