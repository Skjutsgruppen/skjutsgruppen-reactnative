import React, { Component } from 'react';
import Camera from '@components/experience/camera';
import Preview from '@components/experience/preview';
import Participant from '@components/experience/participant';
import Message from '@components/experience/message';
import Confirm from '@components/experience/confirm';
import RNFS from 'react-native-fs';
import PropTypes from 'prop-types';
import { withCreateExperience } from '@services/apollo/experience';

const SCREEN_CAMERA = 'camera';
const SCREEN_PREVIEW = 'preview';
const SCREEN_PARTICIPANT = 'participant';
const SCREEN_MESSAGE = 'message';
const SCREEN_CONFIRM = 'confirm';

class Experience extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({
      trip: {},
      loading: false,
      screen: SCREEN_CAMERA,
      image: '',
      description: '',
      participants: [],
      error: '',
    });
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { trip } = navigation.state.params;
    this.setState({ trip });
  }

  onParticipantSelect = (participants) => {
    this.setState({ participants, screen: SCREEN_MESSAGE });
  }

  onPublish = async (description) => {
    this.setState({ description, screen: SCREEN_CONFIRM }, this.submit);
  }

  submit = async () => {
    const { image, participants, trip, description } = this.state;
    const { createExperience } = this.props;

    try {
      this.setState({ loading: true, error: '' });
      const photo = await RNFS.readFile(image, 'base64');
      const experience = {
        description,
        photo,
        tripId: trip.id,
        participants,
      };

      await createExperience(experience);
      this.setState({ loading: false, error: '' });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  takePicture = (data) => {
    this.setState({ image: data.path, screen: SCREEN_PREVIEW });
  }

  render() {
    const { screen, loading, image, error, trip, participants } = this.state;

    if (screen === SCREEN_PREVIEW) {
      return (
        <Preview
          image={image}
          onBack={() => this.setState({ screen: SCREEN_CAMERA })}
          onNext={() => this.setState({ screen: SCREEN_PARTICIPANT })}
        />
      );
    }

    if (screen === SCREEN_PARTICIPANT) {
      return (
        <Participant
          id={trip.id}
          onBack={() => this.setState({ screen: SCREEN_PREVIEW })}
          participants={participants}
          onNext={this.onParticipantSelect}
        />
      );
    }

    if (screen === SCREEN_MESSAGE) {
      return (
        <Message
          onBack={() => this.setState({ screen: SCREEN_PARTICIPANT })}
          onPublish={this.onPublish}
        />
      );
    }

    if (screen === SCREEN_CONFIRM) {
      return (
        <Confirm
          error={error}
          loading={loading}
          image={image}
          onNext={this.goBack}
          reTry={this.submit}
        />
      );
    }

    return (<Camera onBack={this.goBack} takePicture={this.takePicture} />);
  }
}

Experience.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
  }).isRequired,
  createExperience: PropTypes.func.isRequired,
};


export default withCreateExperience(Experience);
