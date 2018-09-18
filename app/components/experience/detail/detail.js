import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import ToolBar from '@components/utils/toolbar';
import Colors from '@theme/colors';
import Share from '@components/common/share';
import { Container, MoreButton, ActionModal, AppNotification, ModalAction, ConfirmModal, InfoModal } from '@components/common';
import ShareIcon from '@assets/icons/ic_share_white.png';
import { withShare } from '@services/apollo/share';
import { compose } from 'react-apollo';
import { FEEDABLE_EXPERIENCE } from '@config/constant';
import { withMoreExperiences, withDeleteExperience, withSendExperienceEmail } from '@services/apollo/experience';
import List from '@components/experience/list';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExperienceIcon from '@assets/icons/ic_make_experience.png';
import Info from '@components/experience/detail/info';
import { AppText, Title } from '@components/utils/texts';
import { trans } from '@lang/i18n';

const MoreExperiences = withMoreExperiences(List);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
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
      notAvailableModal: false,
    };
    this.isNotAvailableModalDisplayed = false;
  }

  componentWillMount() {
    const { experience, pending, navigation } = this.props;

    const right = !pending ?
      () => <MoreButton animated onPress={() => this.handleOptionsModalVisibility(true)} />
      : null;

    navigation.setParams({
      right,
    });

    this.setState({ experience, showNotification: pending, pending });
  }

  componentWillReceiveProps({ experience, pending }) {
    if (experience && experience.isBlocked) {
      this.setState({ notAvailableModal: true });
    }

    this.setState({ experience, showNotification: pending, pending });
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

  onReportExperience = () => {
    const { navigation } = this.props;
    const { experience } = this.state;
    this.setState({ optionsOpen: false }, () => {
      navigation.navigate('Report', { data: { Experience: experience }, type: FEEDABLE_EXPERIENCE });
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
        separator = ` ${trans('global._and_')} `;
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

  renderReport = () => (<ModalAction label={trans('experience.report_this_experience')} onPress={() => this.onReportExperience()} />)

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


  renderDeleteExperience = () => (<ModalAction label={trans('experience.delete_this_experience')} onPress={this.onDeletePress} />);

  renderSendEmail = () => {
    const { sent, sending } = this.state;
    if (sending) {
      return (<ModalAction label={trans('experience.sending')} onPress={() => { }} />);
    }

    if (sent) {
      return (<ModalAction label={trans('experience.email_sent')} onPress={() => { }} />);
    }

    return (<ModalAction label={trans('experience.send_to_my_email')} onPress={this.onSendEmail} />);
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
        name={trans('experience.experience_is_unpublished')}
        message={trans('experience.only_you_can_see_this_experience')}
        handleClose={() => this.setState({ showNotification: false })}
      />
    );
  }

  renderConfirmModal = () => {
    const { deleting, showConfirm } = this.state;
    const message = <AppText>{trans('experience.are_you_sure_to_delete_this_experience', { participantName: this.getParticipantsName() })}</AppText>;

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

  renderExperienceNotAvailable = () => {
    const { notAvailableModal } = this.state;
    const { navigation } = this.props;

    const message = (<AppText>{trans('experience.experience_not_available')}</AppText>);

    return (
      <InfoModal
        visible={notAvailableModal && !this.isNotAvailableModalDisplayed}
        onRequestClose={() => this.setState({ notAvailableModal: false })}
        message={message}
        onConfirm={() => this.setState({ notAvailableModal: false },
          () => { this.isNotAvailableModalDisplayed = true; navigation.goBack(); })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderExperience = () => {
    const { experience, pending } = this.state;
    const { loading } = this.props;
    let image = null;

    if (experience.photoUrl) {
      image = (<Image source={{ uri: experience.photoUrl }} style={styles.headerImage} />);
    }

    return (
      <Container>
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
                <Title color={Colors.text.white}>{trans('global.share')}</Title>
                <Image source={ShareIcon} style={styles.buttonIcon} />
              </TouchableOpacity>
            </View>
          }
        </View>
        {
          !pending &&
          <MoreExperiences title={trans('experience.experiences_!')} exceptId={experience.id} />
        }
      </Container>
    );
  }

  render() {
    const { experience, showNotification } = this.state;

    return (
      <View style={styles.flex}>
        {this.renderPendingNotification()}
        <ToolBar transparent offset={showNotification ? 70 : 0} />
        {!experience.isBlocked && this.renderExperience()}
        {this.renderShareModal()}
        {this.renderOptionsModal()}
        {this.renderConfirmModal()}
        {this.renderExperienceNotAvailable()}
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
