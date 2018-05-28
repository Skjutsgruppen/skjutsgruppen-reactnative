import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { withExperience } from '@services/apollo/experience';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AcceptExperience from '@components/experience/detail/acceptExperience';
import Detail from '@components/experience/detail/detail';
import ExperienceNotPublished from '@screens/experience/notPublished';
import {
  EXPERIENCE_STATUS_DELETED,
  EXPERIENCE_STATUS_PENDING,
  EXPERIENCE_STATUS_PUBLISHED,
} from '@config/constant';
import { Loading } from '@components/common';
import { getExperienceDetails } from '@services/apollo/dataSync';

class ExperienceDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: {},
      refetch: () => { },
      isRejected: false,
      isAccepted: false,
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { id } = navigation.state.params;
    const experience = getExperienceDetails(id);

    this.setState({ experience });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillReceiveProps({ experience, loading, refetch }) {
    if (!loading && experience.id) {
      this.setState({ experience, refetch });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { navigation, nav } = this.props;

    if (nav && nav.routes.length <= 1) {
      navigation.replace('Tab');
    } else {
      navigation.goBack();
    }

    return true;
  }

  onDelete = () => {
    this.setState({ isRejected: true }, () => {
      this.refetch();
    });
  }

  onAccept = () => {
    const { experience } = this.state;
    const pending = experience.Participants.filter(row => row.status === EXPERIENCE_STATUS_PENDING);

    this.refetch().then(() => {
      if (pending.length <= 1) {
        this.props.navigation.navigate('TripDetail', {
          id: experience.Trip.id,
          trip: {
            ...experience.Trip,
            ...{
              experienceStatus: EXPERIENCE_STATUS_PUBLISHED,
              Participants: { count: experience.Participants.length },
            },
          },
        });
      }
    });
  }

  refetch = async () => {
    const { refetch } = this.state;
    return refetch();
  }

  isActionPending = () => {
    const { experience } = this.state;
    return (experience.userStatus === EXPERIENCE_STATUS_PENDING);
  }

  isStatus = (status) => {
    const { experience } = this.state;
    return experience.publishedStatus === status;
  }

  render() {
    const { experience, isRejected, isAccepted } = this.state;
    const { loading, navigation } = this.props;

    if (Object.keys(experience).length < 1) {
      return <Loading />;
    }

    if (this.isStatus(EXPERIENCE_STATUS_DELETED)) {
      return (
        <ExperienceNotPublished
          experience={experience}
          isRejected={isRejected}
          onBack={() => navigation.goBack()}
        />
      );
    }

    if (this.isActionPending()) {
      return (
        <AcceptExperience
          experience={experience}
          loading={loading}
          onReject={this.onDelete}
          onAccept={this.onAccept}
        />
      );
    }

    if (!isAccepted
      || this.isStatus(EXPERIENCE_STATUS_PUBLISHED)
      || this.isStatus(EXPERIENCE_STATUS_PENDING)) {
      return (
        <Detail
          experience={experience}
          onDelete={this.onDelete}
          loading={loading}
          pending={this.isStatus(EXPERIENCE_STATUS_PENDING)}
        />
      );
    }

    return null;
  }
}

ExperienceDetailScreen.propTypes = {
  experience: PropTypes.shape({
    photo: PropTypes.string,
    User: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
    }),
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  refetch: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    experience: PropTypes.shape({
      photo: PropTypes.string,
      User: PropTypes.shape({
        id: PropTypes.number,
        firstName: PropTypes.string,
      }),
    }),
  }).isRequired,
  nav: PropTypes.shape({
    route: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user, nav: state.nav });

const ExperienceWithDetail = compose(
  withExperience,
  connect(mapStateToProps),
)(ExperienceDetailScreen);


const ExperienceDetail = ({ navigation }) => {
  const { id } = navigation.state.params;

  return (
    <ExperienceWithDetail
      id={id}
      navigation={navigation}
    />
  );
};

ExperienceDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

ExperienceDetail.navigationOptions = {
  header: null,
};

export default ExperienceDetail;
