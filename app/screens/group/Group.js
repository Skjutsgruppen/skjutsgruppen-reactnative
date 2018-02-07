import React, { Component } from 'react';
import { Text, View, StyleSheet, Clipboard } from 'react-native';
import Stretch from '@components/group/stretch';
import OutReach from '@components/group/outreach';
import About from '@components/group/about';
import OpenClosed from '@components/group/openClosed';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { submitGroup } from '@services/apollo/group';
import Share from '@components/common/share';
import Completed from '@components/common/completed';
import { Loading, Wrapper, Container, FloatingNavbar, ProgressBar } from '@components/common';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { GlobalStyles } from '@theme/styles';
import { FEEDABLE_GROUP } from '@config/constant';

const styles = StyleSheet.create({
  progress: {
    paddingHorizontal: 20,
    marginTop: 75,
  },
  stepsCount: {
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
});

class Group extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      outreach: '',
      route: {},
      area: {},
      about: {},
      type: '',
      share: {},
      activeStep: 1,
      disabledTabs: [2, 3, 4, 5],
      completedTabs: [],
      loading: false,
      group: {},
      error: '',
    };
  }

  onStrechNext = (outreach) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(1);
    delete disabledTabs[disabledTabs.indexOf(1)];
    this.setState({ outreach, completedTabs, disabledTabs, activeStep: 2 });
  };

  onOutReachNext = (trip) => {
    const { outreach } = this.state;
    let { area, route } = this.state;

    let error = 0;
    if (outreach === 'area') {
      if (trip.country === '') {
        this.setState({ error: getToast(['COUNTRY_REQUIRED']) });
        error += 1;
      } else if (trip.country === 'SE' && trip.municipality === '') {
        this.setState({ error: getToast(['MUNICIPALITY_REQUIRED']) });
        error += 1;
      }

      area = trip;
    }

    if (outreach === 'route') {
      if (trip.start.coordinates.length === 0) {
        this.setState({ error: getToast(['FROM_REQUIRED']) });
        error += 1;
      } else if (trip.end.coordinates.length === 0) {
        this.setState({ error: getToast(['TO_REQUIRED']) });
        error += 1;
      }

      route = trip;
    }

    if (error === 0) {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(2);
      delete disabledTabs[disabledTabs.indexOf(2)];
      this.setState({ route, area, completedTabs, disabledTabs, activeStep: 3, error: '' });
    }
  };

  onAboutNext = (about) => {
    if (about.photo === '') {
      this.setState({ error: getToast(['GROUP_PHOTO_REQUIRED']) });
    } else if (about.name === '') {
      this.setState({ error: getToast(['GROUP_NAME_REQUIRED']) });
    } else if (about.description === '') {
      this.setState({ error: getToast(['DESCRIPTION_REQUIRED']) });
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(3);
      delete disabledTabs[disabledTabs.indexOf(3)];
      this.setState({ about, completedTabs, disabledTabs, activeStep: 4, error: '' });
    }
  };

  onTypeNext = (type) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(4);
    delete disabledTabs[disabledTabs.indexOf(4)];
    this.setState({ type, completedTabs, disabledTabs, activeStep: 5 });
  };

  onShareAndPublishNext = (share) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(5);
    delete disabledTabs[disabledTabs.indexOf(5)];
    this.setState({
      share, completedTabs, disabledTabs, activeStep: 6, loading: true,
    }, this.createGroup);
  };

  createGroup() {
    const { outreach, route, area, about, type, share } = this.state;

    try {
      this.props.submit(
        outreach,
        route.start,
        route.end,
        route.stops,
        about.name,
        about.description,
        about.photo,
        area.country,
        area.county,
        area.municipality,
        area.locality,
        type,
        share,
      )
        .then((res) => {
          if (share.social.indexOf('copy_to_clip') > -1) {
            Clipboard.setString(res.data.group.url);
          }

          this.setState({ loading: false, group: res.data.group, error: '' });
        })
        .catch(err => this.setState({ loading: false, error: getToast(err) }));
    } catch (err) {
      this.setState({ loading: false, error: getToast(err) });
    }
  }

  renderFinish() {
    const { loading, error, group } = this.state;

    if (loading) {
      return (
        <View style={{ marginTop: 100 }}>
          <Loading />
        </View>
      );
    }

    if (error !== '') {
      return (
        <View style={{ marginTop: 100 }}>
          <Toast message={error} type="error" />
          <CustomButton onPress={this.createGroup} bgColor={Colors.background.darkCyan}>
            Try Again
          </CustomButton>
        </View>
      );
    }

    return (
      <Completed
        detail={group}
        type={FEEDABLE_GROUP}
      />
    );
  }

  render() {
    const { activeStep, error } = this.state;
    const { navigation } = this.props;
    const progressAmount = (activeStep / 6) * 100;

    return (
      <Wrapper bgColor={Colors.background.mutedBlue}>
        <FloatingNavbar
          handleBack={() => navigation.goBack()}
          title="Add a new group"
          transparent={false}
        />
        <Container bgColor="transparent">
          {
            this.state.activeStep <= 5 &&
            <View style={styles.progress}>
              <ProgressBar amount={progressAmount} />
              <Text style={[
                styles.stepsCount,
                GlobalStyles.TextStyles.bold,
                GlobalStyles.TextStyles.light,
                activeStep === 5 ? GlobalStyles.TextStyles.pink : {},
              ]}
              >
                <Text style={GlobalStyles.TextStyles.pink}>Step {activeStep}</Text> of 5
                {
                  activeStep === 5 &&
                  <Text>, well done!</Text>
                }
              </Text>
            </View>
          }
          <Toast message={error} type="error" />
          {(activeStep === 1) && <Stretch onNext={this.onStrechNext} />}
          {(activeStep === 2) &&
            <OutReach
              onNext={this.onOutReachNext}
              outreach={this.state.outreach}
            />}
          {(activeStep === 3) && <About onNext={this.onAboutNext} />}
          {(activeStep === 4) && <OpenClosed onNext={this.onTypeNext} />}
          {(activeStep === 5) && <Share showGroup={false} onNext={this.onShareAndPublishNext} />}
          {(activeStep === 6) && this.renderFinish()}
        </Container>
      </Wrapper>
    );
  }
}

Group.propTypes = {
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

export default compose(submitGroup, connect(mapStateToProps))(Group);
