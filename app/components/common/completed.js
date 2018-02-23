import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import SectionLabel from '@components/add/sectionLabel';
import { withNavigation } from 'react-navigation';
import Trip from '@components/feed/card/trip';
import Group from '@components/feed/card/group';
import { FEEDABLE_TRIP, FEEDABLE_GROUP } from '@config/constant';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginBottom: 75,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginBottom: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  image: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  text: {
    fontSize: 13,
    color: Colors.text.darkGray,
    textAlign: 'center',
    marginBottom: 24,
  },
  blueText: {
    color: Colors.text.blue,
  },
  textUnderlined: {
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  uniqueAddress: {
    fontSize: 16,
    color: '#1ca9e5',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginVertical: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
  },
});

const Completed = ({ detail, type, navigation, isReturnedTrip, onMakeReturnRide }) => (
  <View style={styles.wrapper}>
    <SectionLabel label="Published" />
    {
      (type === FEEDABLE_TRIP) &&
      <Trip
        onPress={() => navigation.navigate('TripDetail', { trip: detail })}
        trip={detail}
      />
    }

    {
      (type === FEEDABLE_GROUP) &&
      <Group
        onPress={() => navigation.navigate('GroupDetail', { group: detail })}
        group={detail}
      />
    }

    {
      isReturnedTrip &&
      <View style={styles.footer}>
        <RoundedButton
          onPress={onMakeReturnRide}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Add return ride
        </RoundedButton>
      </View>
    }
  </View>
);

Completed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  detail: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  type: PropTypes.oneOf([FEEDABLE_TRIP, FEEDABLE_GROUP]).isRequired,
  isReturnedTrip: PropTypes.bool,
  onMakeReturnRide: PropTypes.func,
};

Completed.defaultProps = {
  isReturnedTrip: false,
  onMakeReturnRide: () => { },
};

export default withNavigation(Completed);
