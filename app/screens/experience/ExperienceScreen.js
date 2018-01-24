import React, { Component } from 'react';
import { withExperience } from '@services/apollo/experience';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AcceptExperience from '@components/experience/detail/acceptExperience';
import Detail from '@components/experience/detail/Detail';
import PendingExperiencePublish from '@components/experience/detail/pendingExperiencePublish';

class ExperienceDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { experience: {}, refetch: null };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const { experience } = navigation.state.params;
    this.setState({ experience });
  }

  componentWillReceiveProps({ experience, loading, refetch }) {
    if (!loading && experience.id) {
      this.setState({ experience, refetch });
    }
  }

  refresh = () => {
    const { refetch } = this.state;

    if (typeof refetch === 'function') {
      return refetch();
    }

    return null;
  }

  isExperienceTagAccepted = () => {
    const { experience } = this.state;
    const { user } = this.props;
    const owner = experience.Participants.filter((participant) => {
      if (user.id === participant.User.id) {
        return true;
      }
      return false;
    });

    if (owner.length < 1) {
      return true;
    }

    return !(owner[0].status === 'pending');
  }

  isTagAcceptedByAll = () => {
    const { experience } = this.state;
    const pendingParticipants = experience.Participants.filter((participant) => {
      if (participant.status === 'pending') {
        return true;
      }

      return false;
    });

    return (pendingParticipants.length === 0);
  }

  goBack = () => {
    const { navigation } = this.props;

    navigation.goBack();
  }

  render() {
    const { experience } = this.state;
    const { loading } = this.props;

    if (this.isExperienceTagAccepted()) {
      if (this.isTagAcceptedByAll()) {
        return (<Detail experience={experience} loading={loading} />);
      }

      return (
        <PendingExperiencePublish
          experience={experience}
          onPress={this.goBack}
          loading={loading}
        />
      );
    }

    return (<AcceptExperience experience={experience} loading={loading} refresh={this.refresh} />);
  }
}

ExperienceDetailScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    experience: PropTypes.shape({
      Participants: PropTypes.array,
      Trip: PropTypes.object,
      User: PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
      }),
    }),
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

const ExperienceWithDetail = compose(
  withExperience,
  connect(mapStateToProps),
)(ExperienceDetailScreen);


const ExperienceScreen = ({ navigation }) => {
  const { experience } = navigation.state.params;
  return (<ExperienceWithDetail id={experience.id} navigation={navigation} />);
};

ExperienceScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

ExperienceScreen.navigationOptions = {
  header: null,
};

export default ExperienceScreen;
