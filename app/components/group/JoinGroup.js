import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { compose } from 'react-apollo';
import { OPEN_GROUP, CLOSE_GROUP, STRETCH_TYPE_AREA, STRETCH_TYPE_ROUTE, FEEDABLE_GROUP } from '@config/constant';
import PropTypes from 'prop-types';
import { withJoinGroup, withGroupMembers } from '@services/apollo/group';
import ToolBar from '@components/utils/toolbar';
import { Wrapper, Container, Loading, ShareButton } from '@components/common';
import Colors from '@theme/colors';
import Share from '@components/common/share';
import { withShare } from '@services/apollo/share';
import GroupImage from '@components/group/groupImage';
import GroupMap from '@components/group/groupMap';
import Participants from '@components/group/participants';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { withNavigation } from 'react-navigation';

const ParticipantListBubble = withGroupMembers(Participants);

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.text.blue,
    marginHorizontal: 16,
    marginTop: 24,
  },
  text: {
    marginHorizontal: 16,
    marginVertical: 4,
    lineHeight: 20,
    color: '#333',
  },
  hearderStyles: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
    borderRadius: 0,
  },
  aboutTitle: {
    marginTop: 6,
    marginBottom: 8,
  },
  stopText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  stopsIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 4,
  },
  stops: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 24,
    marginBottom: 50,
  },
  msgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  lightText: {
    color: Colors.text.gray,
  },
  whitebg: {
    backgroundColor: Colors.background.fullWhite,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.background.fullWhite,
    elevation: 15,
    shadowOffset: { width: 0, height: -4 },
    shadowColor: Colors.background.black,
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  participateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    borderRadius: 24,
    paddingHorizontal: 50,
    backgroundColor: Colors.background.pink,
  },
  buttonText: {
    color: Colors.text.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
});

class JoinGroup extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: false,
      isPending: null,
      group: {},
      requestSent: false,
      showShareModal: false,
      error: '',
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    this.updateState(this.props);

    navigation.setParams({
      right: () => <ShareButton onPress={() => this.setState({ showShareModal: true })} animated />,
    });
  }

  componentWillReceiveProps(props) {
    this.updateState(props);
  }

  onMapPress = () => {
    const { navigation, group } = this.props;

    if (group.outreach === STRETCH_TYPE_AREA && group.areaCoordinates) {
      const coordinates = { area: group.areaCoordinates };

      navigation.navigate('Area', { coordinates, info: group });
    }

    if (group.outreach === STRETCH_TYPE_ROUTE) {
      const coordinates = {
        start: group.TripStart,
        end: group.TripEnd,
        stops: group.Stops,
      };

      navigation.navigate('Route', { coordinates, info: group });
    }

    return null;
  }

  updateState = ({ group }) => {
    const isPending = group.membershipStatus === 'pending';
    this.setState({ group, isPending });
  }

  joinGroup = () => {
    const { group } = this.state;
    const { submit, refresh } = this.props;

    this.setState({ loading: true }, () => submit(group.id).then(refresh).then(() => {
      if (group.type === CLOSE_GROUP) {
        this.setState({ requestSent: true, loading: false });
      }
    }).catch((err) => {
      this.setState({ loading: false, error: getToast(err) });
    }));
  }

  renderButton = () => {
    const { loading, requestSent, isPending, error } = this.state;
    const { group } = this.props;

    if (loading || isPending === null) {
      return (
        <View style={styles.footer}>
          <View style={styles.msgWrapper}>
            <Loading />
          </View>
        </View>
      );
    }

    if (requestSent) {
      return (
        <View style={styles.footer}>
          <View style={styles.msgWrapper}>
            <Text style={styles.lightText}>Request has been sent</Text>
          </View>
        </View>
      );
    }

    if (isPending) {
      return (
        <View style={styles.footer}>
          <View style={styles.msgWrapper}>
            <Text style={styles.lightText}>Your Request is pending.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.footer}>
        <Toast message={error} type="error" />
        <TouchableOpacity
          style={styles.participateButton}
          onPress={this.joinGroup}
        >
          <Text style={styles.buttonText}>
            {group.type === OPEN_GROUP && 'Participate'}
            {group.type === CLOSE_GROUP && 'Ask to participate'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderShareModal() {
    const { showShareModal, group } = this.state;
    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={FEEDABLE_GROUP}
          detail={group}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  render() {
    const { group } = this.props;

    if (group.isDeleted) {
      return null;
    }

    return (
      <Wrapper bgColor={Colors.background.fullWhite}>
        <ToolBar transparent />
        <Container>
          {
            group.photo &&
            <GroupImage group={group} />
          }
          {
            group.mapPhoto &&
            <GroupMap
              group={group}
              onMapPress={this.onMapPress}
              showOverlay={group.photo === null}
            />
          }
          <Text style={styles.sectionTitle}>{'Participants'.toUpperCase()}</Text>
          <ParticipantListBubble id={group.id} offset={0} />
          <Text style={[styles.sectionTitle, styles.aboutTitle]}>{'About'.toUpperCase()}</Text>
          <Text style={styles.text}>
            {group.type === OPEN_GROUP && 'Open Group'}
            {group.type === CLOSE_GROUP && 'Closed Group'}
          </Text>
          <Text style={styles.text}>
            {group.outreach === STRETCH_TYPE_AREA && [group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')}
            {group.outreach === STRETCH_TYPE_ROUTE && `${group.TripStart.name || group.direction} - ${group.TripEnd.name || group.direction}`}
          </Text>
          {
            group.Stops && group.Stops.length > 0 &&
            <View style={styles.stopText}>
              <Image source={require('@assets/icons/icon_stops.png')} style={styles.stopsIcon} />
              <Text style={{ color: '#333' }}>
                Stops in
                <Text style={styles.stops}> {group.Stops.map(place => place.name).join(', ')}</Text>
              </Text>
            </View>
          }
          <Text style={[styles.text, styles.description]}>
            {group.description}
          </Text>
        </Container>
        {this.renderButton()}
        {this.renderShareModal()}
      </Wrapper>
    );
  }
}

JoinGroup.propTypes = {
  submit: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  group: PropTypes.shape({
    membershipStatus: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default compose(
  withShare,
  withJoinGroup,
  withNavigation,
)(JoinGroup);
