import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import Toolbar from '@components/utils/toolbar';
import { ShareButton, RoundedButton } from '@components/common';
import GroupMap from '@components/group/groupMap';
import MembershipRequest from '@components/group/membershipRequest/membershipRequestAvatar';
import ParticipantAvatar from '@components/group/participantAvatar';
import { withGroupMembers, withGroupMembershipRequest } from '@services/apollo/group';
import { OPEN_GROUP, CLOSE_GROUP, STRETCH_TYPE_AREA, STRETCH_TYPE_ROUTE } from '@config/constant';
import Share from '@components/common/share';

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    backgroundColor: Colors.background.mutedBlue,
  },
  footer: {
    padding: 20,
    elevation: 10,
    backgroundColor: Colors.background.fullWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.text.blue,
    marginHorizontal: 16,
    marginTop: 24,
  },
  aboutTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    marginHorizontal: 16,
    marginVertical: 4,
    lineHeight: 20,
    color: '#333',
  },
  description: {
    marginTop: 24,
    marginBottom: 50,
  },
});

const ParticipantListBubble = withGroupMembers(ParticipantAvatar);
const MembershipRequestBubble = withGroupMembershipRequest(MembershipRequest);
const Enablers = withGroupMembers(ParticipantAvatar);

class GroupInformation extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { showShareModal: false };
  }

  onPress = (type) => {
    const { navigation } = this.props;
    const { group } = navigation.state.params;

    if (type === 'EnablerList') {
      navigation.navigate('EnablerList', { group });
    }

    if (type === 'MembershipRequest') {
      navigation.navigate('MembershipRequest', { id: group.id });
    }

    if (type === 'Participants') {
      navigation.navigate('Participants', { group });
    }

    if (type === 'EditGroup') {
      navigation.navigate('EditGroup', { id: group.id });
    }
  }

  renderShareButton = () => (
    <ShareButton
      onPress={() => this.setState({ showShareModal: true })}
      animated={false}
    />
  );

  renderButton = () => (
    <RoundedButton
      onPress={() => this.onPress('EditGroup')}
      bgColor={Colors.background.pink}
      style={styles.button}
    >
      Change
    </RoundedButton>
  );

  renderShareModal = () => {
    const { navigation } = this.props;
    const { group } = navigation.state.params;

    return (
      <Modal
        visible={this.state.showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={'Group'}
          detail={group}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  renderStops = (Stops) => {
    let stopText = 'Stops in ';

    Stops.forEach((stop, index) => {
      if (index > 0) {
        stopText += ', ';
      }
      stopText += stop.name;
    });

    return stopText;
  }

  render() {
    const { navigation } = this.props;

    if (!navigation.state.params) {
      return null;
    }

    const { group } = navigation.state.params;

    return (
      <View style={styles.contentWrapper}>
        <Toolbar
          title={group.name}
          transparent={false}
          right={this.renderShareButton}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: Colors.background.fullWhite }}
        >
          {group.mapPhoto &&
            <GroupMap
              group={group}
              onMapPress={() => { }}
              showOverlay={false}
            />
          }
          <View style={{ height: 12 }} />
          <ParticipantListBubble
            id={group.id}
            offset={0}
            onPress={this.onPress}
            displayCount
            enabler={false}
          />
          {group.isAdmin &&
            <MembershipRequestBubble
              id={group.id}
              onPress={this.onPress}
            />
          }
          <Enablers
            id={group.id}
            onPress={this.onPress}
            offset={0}
            enabler
          />
          <View style={{ backgroundColor: '#fff' }}>
            <Text style={[styles.sectionTitle, styles.aboutTitle]}>{'About'.toUpperCase()}</Text>
            <Text style={styles.text}>
              {group.type === OPEN_GROUP && 'Open Group'}
              {group.type === CLOSE_GROUP && 'Closed Group'}
            </Text>
            <Text style={styles.text}>
              {group.outreach === STRETCH_TYPE_AREA && [group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
              {group.outreach === STRETCH_TYPE_ROUTE && `${group.TripStart.name} - ${group.TripEnd.name}`}
            </Text>
            <Text style={styles.text}>
              {group.outreach === STRETCH_TYPE_ROUTE
                && group.Stops.length > 0
                && this.renderStops(group.Stops)}
            </Text>
            <Text style={[styles.text, styles.description]}>
              {group.description}
            </Text>
          </View>
        </ScrollView>
        {group.isAdmin &&
          <View style={styles.footer}>
            {this.renderButton()}
          </View>
        }
        {this.renderShareModal()}
      </View>
    );
  }
}

GroupInformation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default GroupInformation;
