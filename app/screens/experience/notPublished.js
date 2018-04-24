import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import Date from '@components/date';
import { Wrapper, FloatingBackButton, RoundedButton } from '@components/common';
import { Colors } from '@theme';
import { AppText, Heading } from '@components/utils/texts';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  text: {
    color: Colors.text.white,
    textAlign: 'center',
    lineHeight: 32,
    marginVertical: 16,
  },
  header: {
    height: 70,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  button: {
    paddingHorizontal: 32,
    width: '50%',
    marginTop: 32,
  },
});

const ExperienceNotPublished = ({ experience, navigation, onBack, isRejected }) => (
  <Wrapper bgColor={Colors.background.darkGray}>
    <View style={styles.header}>
      <FloatingBackButton onPress={() => onBack()} />
    </View>
    <ScrollView>
      <View style={styles.content}>
        <Heading centered fontVariation="bold" style={{ marginVertical: 24 }}>{trans('experience.experience_not_published')}</Heading>
        {
          !isRejected &&
          <Heading centered fontVariation="bold" style={{ marginVertical: 24 }}>
            {trans('experience.one_or_more_participants_did_not_agree')}
          </Heading>
        }
        <AppText style={styles.text}>
          {trans('experience.if_not_everyone_tag_in_experience_not_published')}
        </AppText>
        {
          experience.Trip && experience.Trip.TripStart &&
          <AppText style={styles.text}>
            {trans('experience.this_concerns_your_experience_on')} <Date format="MMM DD">{experience.createdAt}</Date>
            {trans('experience.experience_from_and_to', { tripStart: experience.Trip.TripStart.name, tripEnd: experience.Trip.TripEnd.name })}
          </AppText>
        }
        {
          experience.Trip && experience.Trip.TripStart &&
          <RoundedButton
            onPress={() => navigation.navigate('TripDetail', { trip: experience.Trip })}
            bgColor={Colors.background.pink}
            style={styles.button}
          >
            {trans('experience.go_to_ride')}
          </RoundedButton>
        }
      </View>
    </ScrollView>
  </Wrapper>
);

ExperienceNotPublished.propTypes = {
  experience: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isRejected: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
};

ExperienceNotPublished.defaultProps = {
  isRejected: false,
};

export default withNavigation(ExperienceNotPublished);

