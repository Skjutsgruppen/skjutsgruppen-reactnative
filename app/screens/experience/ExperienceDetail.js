import React, { Component } from 'react';
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

class ExperienceDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      experience: {},
      refetch: () => { },
      isRejected: false,
      isAccepted: false,
      fetch: false,
    };
  }

  componentWillMount() {
    const { navigation, fetch } = this.props;
    const { experience } = navigation.state.params;
    this.setState({ experience, fetch });
  }

  componentWillReceiveProps({ experience, loading, refetch }) {
    if (!loading && experience.id) {
      this.setState({ experience, refetch, fetch: false });
    }
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
    const { experience, isRejected, isAccepted, fetch } = this.state;
    const { loading, navigation } = this.props;

    if (fetch) {
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
  fetch: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const ExperienceWithDetail = compose(
  withExperience,
  connect(mapStateToProps),
)(ExperienceDetailScreen);


const ExperienceDetail = ({ navigation }) => {
  const { experience, fetch } = navigation.state.params;
  return (
    <ExperienceWithDetail
      id={experience.id}
      navigation={navigation}
      fetch={fetch || false}
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
