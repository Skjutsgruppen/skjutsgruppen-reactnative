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
import { trans } from '@lang/i18n';
import { UcFirst } from '@config';

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
  profilePicWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    borderWidth: 4,
    borderColor: Colors.border.white,
    backgroundColor: Colors.background.lightGray,
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
        separator = ` ${trans('global._and_')} `;
      } else if (index < (experience.Participants.length - 1)) {
        separator = ', ';
      }

      if (row.User.deleted) {
        deletedParticipantCount += 1;
        return (<AppText key={row.User.id}>
          <AppText fontVariation="bold">
            {deletedParticipantCount <= 1 ? trans('experience.deleted_participant') : trans('experience.count_deleted_participants', { count: deletedParticipantCount })}
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
          {trans('experience.went_from_start_to_end_on',
            {
              tripStart: experience.Trip.TripStart.name || UcFirst(experience.Trip.direction),
              tripEnd: experience.Trip.TripEnd.name || UcFirst(experience.Trip.direction),
            })} <Date format="MMM DD, YYYY">{experience.Trip.date}</Date>. {
            experience.Trip.isDeleted
              ? <AppText fontVariation="bold">{trans('experience.this_ride_has_been_deleted')}</AppText>
              : <AppText color={Colors.text.blue} fontVariation="bold">{trans('experience.see_the_trip_here')}</AppText>
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
                  <View
                    style={[
                      styles.profilePicWrapper,
                      index > 0 && { left: (index * imageSize) - (margin * index) },
                      { zIndex },
                    ]}
                  >
                    <Image
                      key={User.id}
                      source={{ uri: User.avatar }}
                      style={styles.profilePic}
                    />
                  </View>
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
