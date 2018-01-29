import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import Date from '@components/date';
import { Wrapper, FloatingBackButton, RoundedButton } from '@components/common';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  whiteText: {
    color: Colors.text.white,
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
    lineHeight: 32,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
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
        <Text style={[styles.whiteText, styles.title]}>Experience not published.</Text>
        {
          !isRejected &&
          <Text style={[styles.whiteText, styles.title]}>
            One or more participants did not agree.
          </Text>
        }
        <Text style={styles.whiteText}>
          If not everyone tagged in the Experiece agrees the Experience is not published.
        </Text>
        {
          experience.Trip && experience.Trip.TripStart &&
          <Text style={styles.whiteText}>
            This concers your Experience on <Date format="MMM DD">{experience.createdAt}</Date>
            {` From ${experience.Trip.TripStart.name} to ${experience.Trip.TripEnd.name}`}
          </Text>
        }
        {
          experience.Trip && experience.Trip.TripStart &&
          <RoundedButton
            onPress={() => navigation.navigate('TripDetail', { trip: experience.Trip })}
            bgColor={Colors.background.pink}
            style={styles.button}
          >
            Go to ride
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

