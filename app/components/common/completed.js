import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { Wrapper, Container, RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import SectionLabel from '@components/add/sectionLabel';
import { withNavigation } from 'react-navigation';
import Trip from '@components/feed/card/trip';
import Group from '@components/feed/card/group';
import { FEEDABLE_TRIP, FEEDABLE_GROUP } from '@config/constant';
import TabBar from '@components/common/tabBar';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginBottom: 75,
    backgroundColor: 'green',
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
    backgroundColor: Colors.background.mutedBlue,
    elevation: 15,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginVertical: 32,
  },
  link: {
    color: Colors.text.blue,
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
});

const getTitle = (isReturnedTrip, suggestion, group, isRecurring) => {
  if (isReturnedTrip && Object.keys(suggestion).length > 0) {
    return `Published and  offered to ${suggestion.User.firstName}`;
  }

  if (Object.keys(group).length > 0) {
    return `Published in ${group.name}`;
  }

  if (isRecurring) return 'All of your rides are published!';

  return 'Published!';
};

const Completed = ({
  detail,
  type,
  navigation,
  isReturnedTrip,
  onMakeReturnRide,
  suggestion,
  group,
  isRecurring,
}) =>
  (
    <Wrapper>
      <Container>
        <SectionLabel
          label={getTitle(isReturnedTrip, suggestion, group, isRecurring)}
          style={{ marginTop: 30 }}
        />
        {
          (type === FEEDABLE_TRIP) &&
          <Trip
            onPress={() => navigation.navigate('TripDetail', { trip: detail })}
            trip={detail}
            shouldHandleRecurring
          />
        }

        {
          (type === FEEDABLE_GROUP) &&
          <Group
            onPress={() => navigation.navigate('GroupDetail', { group: detail })}
            group={detail}
          />
        }
      </Container>
      <View style={styles.footer}>
        {
          isReturnedTrip &&
          <RoundedButton
            onPress={onMakeReturnRide}
            bgColor={Colors.background.pink}
            style={styles.button}
          >
            Add return ride
          </RoundedButton>
        }
        {
          Object.keys(suggestion).length > 0 &&
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('TripDetail', { trip: suggestion })}
          >
            Back to {suggestion.User.firstName}{"'"}s ride
          </Text>
        }
        {
          Object.keys(group).length > 0 && isReturnedTrip &&
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('GroupDetail', { group, fetch: true })}
          >
            Back to {group.name}
          </Text>
        }
        {
          Object.keys(group).length > 0 && !isReturnedTrip &&
          <RoundedButton
            onPress={() => navigation.navigate('GroupDetail', { group, fetch: true })}
            bgColor={Colors.background.pink}
            style={styles.button}
          >
            Back to group
          </RoundedButton>
        }
        <TabBar />
      </View>
    </Wrapper>
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
  suggestion: PropTypes.shape({
    User: PropTypes.shape({
      firstName: PropTypes.string,
    }),
    id: PropTypes.number,
  }),
  group: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  isRecurring: PropTypes.bool,
};

Completed.defaultProps = {
  isReturnedTrip: false,
  onMakeReturnRide: () => { },
  suggestion: {},
  group: {},
  isRecurring: false,
};

export default withNavigation(Completed);
