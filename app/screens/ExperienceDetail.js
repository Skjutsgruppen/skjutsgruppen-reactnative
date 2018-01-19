import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { FloatingNavbar } from '@components/common';
import ShareIcon from '@icons/ic_share_white.png';
import Date from '@components/date';
import { FEEDABLE_EXPERIENCE } from '@config/constant';
import Share from '@components/common/share';
import { withShare } from '@services/apollo/auth';
import { withMoreExperiences } from '@services/apollo/experience';
import List from '@components/experience/list';

const styles = StyleSheet.create({
  viewHeaderImage: {
    width: '100%',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoSection: {
    padding: 24,
    backgroundColor: Colors.background.fullWhite,
  },
  block: {
    paddingVertical: 12,
  },
  name: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  actions: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background.pink,
    paddingHorizontal: 16,
    width: '75%',
    maxWidth: 200,
  },
  buttonLabel: {
    color: Colors.text.white,
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 12,
  },
});

const MoreExperiences = withMoreExperiences(List);

class ExperienceDetail extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({
      modalDetail: {},
      modalType: '',
      isOpen: false,
      experience: {},
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { experience } = navigation.state.params;
    this.setState({ experience });
  }

  onSharePress = () => {
    this.setState({ isOpen: true });
  }

  onShare = (share) => {
    this.props.share({ id: this.state.experience.id, type: FEEDABLE_EXPERIENCE, share })
      .then(() => this.setState({ isOpen: false }))
      .catch(console.warn);
  };

  onClose = () => {
    this.setState({ isOpen: false });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  redirectTrip = () => {
    const { navigation } = this.props;
    const { experience } = this.state;

    navigation.navigate('TripDetail', { trip: experience.Trip });
  }

  renderParticipants = () => {
    const { navigation } = this.props;
    const { experience } = this.state;
    const going = experience.Participants.filter(row => row.status === 'accepted');
    return going.map((row, index) => {
      let separator = ' ';
      if (index === (going.length - 2)) {
        separator = ' and ';
      } else if (index < (going.length - 1)) {
        separator = ', ';
      }

      return (<Text key={row.User.id}>
        <Text
          onPress={() => navigation.navigate('UserProfile', { profileId: row.User.id })}
          style={styles.name}
        >
          {`${row.User.firstName} ${row.User.lastName}`}
        </Text>
        {separator}
      </Text>);
    });
  }

  renderShareModal() {
    return (
      <Modal
        visible={this.state.isOpen}
        onRequestClose={() => this.setState({ isOpen: false })}
        animationType="slide"
      >
        <ScrollView>
          <Share
            modal
            onNext={this.onShare}
            onClose={this.onClose}
          />
        </ScrollView>
      </Modal>
    );
  }

  render() {
    const { experience } = this.state;
    let image = <View style={styles.viewHeaderImage} />;

    if (experience.photo) {
      image = (<Image source={{ uri: experience.photo }} style={styles.headerImage} />);
    }

    return (
      <View>
        <FloatingNavbar handleBack={this.goBack} />
        <ScrollView>
          {image}
          <View style={styles.infoSection}>
            <View style={styles.block}>
              <Text>Participants</Text>
            </View>
            <View style={styles.block}>
              <Text>
                {this.renderParticipants()}
                <Text onPress={this.redirectTrip}>
                  <Text>
                    went from {experience.Trip.TripStart.name} to {experience.Trip.TripEnd.name} on <Date format="MMM DD, YYYY">{experience.Trip.date}</Date>
                    . <Text style={styles.name}>See their trip here</Text>
                  </Text>
                </Text>
              </Text>
            </View>
            <View style={styles.block}>
              <Text>
                {experience.description}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={this.onSharePress} style={styles.button}>
                <Text style={styles.buttonLabel}>Share</Text>
                <Image source={ShareIcon} style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <MoreExperiences title="Experiences!" exceptId={experience.id} />
        </ScrollView>
        {this.renderShareModal()}
      </View>
    );
  }
}

ExperienceDetail.propTypes = {
  share: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withShare(ExperienceDetail);
