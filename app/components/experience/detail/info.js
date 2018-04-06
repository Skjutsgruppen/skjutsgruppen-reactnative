import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from 'react-native';
import { Loading } from '@components/common';
import Date from '@components/date';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { withNavigation } from 'react-navigation';
import { AppText } from '@components/utils/texts';

const imageSize = 48;
const margin = 12;

const styles = StyleSheet.create({
  block: {
    paddingVertical: 12,
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
});


const Info = ({ loading, experience, navigation }) => {
  const renderParticipants = () => {
    if (!experience.Participants) {
      return null;
    }

    let deletedParticipantCount = 0;

    return experience.Participants.map((row, index) => {
      let separator = ' ';
      if (index === (experience.Participants.length - 2)) {
        separator = ' and ';
      } else if (index < (experience.Participants.length - 1)) {
        separator = ', ';
      }

      if (row.User.deleted) {
        deletedParticipantCount += 1;
        return (<AppText key={row.User.id}>
          <AppText fontVariation="bold">
            {deletedParticipantCount <= 1 ? 'Deleted Participant' : `${deletedParticipantCount} Deleted Participants`}
          </AppText>
          {separator}
        </AppText>);
      }

      return (<AppText key={row.User.id}>
        <AppText
          color={Colors.text.blue}
          fontVariation="bold"
          onPress={() => navigation.navigate('Profile', { profileId: row.User.id })}
        >
          {row.User.firstName}
        </AppText>
        {separator}
      </AppText>);
    });
  };


  const renderTripInfo = () => {
    if (!experience.Trip) {
      return null;
    }

    return (
      <AppText onPress={() => {
        if (experience.Trip.isDeleted) return null;
        return navigation.navigate('TripDetail', { trip: experience.Trip });
      }}
      >
        <AppText>
          went from {experience.Trip.TripStart.name} to {experience.Trip.TripEnd.name} on <Date format="MMM DD, YYYY">{experience.Trip.date}</Date>
          . {experience.Trip.isDeleted
            ? <AppText fontVariation="bold">This ride has been deleted</AppText>
            : <AppText color={Colors.text.blue} fontVariation="bold">See their trip here</AppText>
          }
        </AppText>
      </AppText>
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
                  <AppText size={14} color={Colors.text.white}>
                    +{(participants.length + 1) - maxImage}
                  </AppText>
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
        <AppText>
          {renderParticipants()}
          {renderTripInfo()}
        </AppText>
      </View>
      <View style={styles.block}>
        <AppText>
          {experience.description}
        </AppText>
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
