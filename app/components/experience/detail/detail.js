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
import { withNavigation } from 'react-navigation';
import Colors from '@theme/colors';
import Share from '@components/common/share';
import { FloatingNavbar, ActionModal, AppNotification, ModalAction } from '@components/common';
import ShareIcon from '@assets/icons/ic_share_white.png';
import { withShare } from '@services/apollo/share';
import { compose } from 'react-apollo';
import { FEEDABLE_EXPERIENCE } from '@config/constant';
import { withMoreExperiences, withDeleteExperience, withSendExperienceEmail } from '@services/apollo/experience';
import List from '@components/experience/list';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';
import ConfirmModal from '@components/common/confirmModal';
import Info from '@components/experience/detail/info';

const MoreExperiences = withMoreExperiences(List);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    paddingHorizontal: 24,
    paddingBottom: 24,
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

class ExperienceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: {},
      showShareModal: false,
      optionsOpen: false,
      deleting: false,
      sent: false,
      sending: false,
      showConfirm: false,
      showNotification: false,
    };
  }

  componentWillMount() {
    const { experience, pending } = this.props;

    this.setState({ experience, showNotification: pending });
  }

  componentWillReceiveProps({ experience, pending }) {
    this.setState({ experience, showNotification: pending });
  }

  onDeletePress = () => {
    this.setState({ optionsOpen: false, showConfirm: true });
  }

  onSendEmail = () => {
    const { experience } = this.state;
    this.setState({ sending: true }, () => {
      this.props.sendExperienceEmail(experience.id)
        .then(() => {
          this.setState({ sent: true, sending: false, optionsOpen: false });
        })
        .catch((error) => {
          this.setState({ sending: false, optionsOpen: false });
          console.warn(error);
        });
    });
  }

  getParticipantsName = () => {
    const { experience } = this.state;

    if (!experience.Participants) {
      return null;
    }

    let name = '';

    experience.Participants.forEach((row, index) => {
      let separator = ' ';
      if (index === (experience.Participants.length - 2)) {
        separator = ' and ';
      } else if (index < (experience.Participants.length - 1)) {
        separator = ', ';
      }

      name += `${row.User.firstName}${separator}`;
    });

    return name;
  }

  handleOptionsModalVisibility = (visibility) => {
    this.setState({ optionsOpen: visibility });
  }

  deleteExperience = () => {
    const { experience } = this.state;

    this.setState({ deleting: true }, () => {
      this.props.deleteExperience(experience.id)
        .then(this.props.onDelete)
        .catch((error) => {
          this.setState({ deleting: false, showConfirm: false });
          console.warn(error);
        });
    });
  }

  isParticipant = () => {
    const { experience } = this.state;
    const { user } = this.props;
    if (!experience.Participants) {
      return false;
    }

    let isParticipant = false;
    experience.Participants.forEach((row) => {
      if (row.User.id === user.id) {
        isParticipant = true;
      }
    });

    return isParticipant;
  }

  renderReport = () => (<ModalAction label="Report this experience" onPress={() => { }} />)

  renderShareModal() {
    if (this.props.pending) {
      return null;
    }

    const { showShareModal, experience } = this.state;
    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal
          type={FEEDABLE_EXPERIENCE}
          detail={experience}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }


  renderDeleteExperience = () => (<ModalAction label="Delete this experience" onPress={this.onDeletePress} />);

  renderSendEmail = () => {
    const { sent, sending } = this.state;
    if (sending) {
      return (<ModalAction label="Sending..." onPress={() => { }} />);
    }

    if (sent) {
      return (<ModalAction label="Email Sent!" onPress={() => { }} />);
    }

    return (<ModalAction label="Send to my e-mail" onPress={this.onSendEmail} />);
  }

  renderOptionsModal() {
    if (this.props.pending) {
      return null;
    }

    return (
      <ActionModal
        transparent
        visible={this.state.optionsOpen}
        onRequestClose={() => this.handleOptionsModalVisibility(false)}
        animationType="slide"
      >
        {this.renderSendEmail()}
        {this.isParticipant() ? this.renderDeleteExperience() : this.renderReport()}
      </ActionModal>
    );
  }

  renderPendingNotification = () => {
    if (!this.state.showNotification) {
      return null;
    }
    return (
      <AppNotification
        image={ExperienceIcon}
        type="icon"
        name="Experience is unpublished"
        message="Only you can see this.We' re waiting for the other participants to accept"
        handleClose={() => this.setState({ showNotification: false })}
      />
    );
  }

  renderConfirmModal = () => {
    const { deleting, showConfirm } = this.state;
    const message = <Text>{`Are you sure? This will delete the experience for ${this.getParticipantsName()}`}</Text>;

    return (
      <ConfirmModal
        visible={showConfirm}
        loading={deleting}
        onDeny={() => this.setState({ showConfirm: false })}
        onConfirm={this.deleteExperience}
        message={message}
        onRequestClose={() => this.setState({ showConfirm: false })}
      />
    );
  }

  render() {
    const { experience, showNotification } = this.state;
    const { navigation, loading, pending } = this.props;

    let image = null;

    if (experience.photoUrl) {
      image = (<Image source={{ uri: experience.photoUrl }} style={styles.headerImage} />);
    }

    return (
      <View style={styles.flex}>
        {this.renderPendingNotification()}
        <FloatingNavbar
          handleBack={() => navigation.goBack()}
          showMore={!pending}
          handleShowMore={() => this.handleOptionsModalVisibility(true)}
          offset={showNotification ? 70 : 0}
        />
        <ScrollView style={styles.flex}>
          {image}
          <View style={styles.infoSection}>
            <Info experience={experience} loading={loading} />
            {
              (!pending && !loading) &&
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => this.setState({ showShareModal: true })}
                  style={styles.button}
                >
                  <Text style={styles.buttonLabel}>Share</Text>
                  <Image source={ShareIcon} style={styles.buttonIcon} />
                </TouchableOpacity>
              </View>
            }
          </View>
          {
            !pending &&
            <MoreExperiences title="Experiences!" exceptId={experience.id} />
          }
        </ScrollView>
        {this.renderShareModal()}
        {this.renderOptionsModal()}
        {this.renderConfirmModal()}
      </View>
    );
  }
}

ExperienceDetail.propTypes = {
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
  deleteExperience: PropTypes.func.isRequired,
  sendExperienceEmail: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  pending: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withNavigation,
  withDeleteExperience,
  withShare,
  withSendExperienceEmail,
  connect(mapStateToProps),
)(ExperienceDetail);
