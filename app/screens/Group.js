import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image, Clipboard } from 'react-native';
import Tab from '@components/tab';
import Stretch from '@components/group/stretch';
import OutReach from '@components/group/outreach';
import About from '@components/group/about';
import OpenClosed from '@components/group/openClosed';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { submitGroup } from '@services/apollo/group';
import Share from '@components/common/share';
import Completed from '@components/group/completed';
import { Loading, Wrapper, Container } from '@components/common';

const styles = StyleSheet.create({
  backButtonWrapper: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  backIcon: {
    height: 13,
    resizeMode: 'contain',
    marginRight: 6,
  },
  backText: {
    color: '#999',
    fontSize: 13,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    margin: 12,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
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
      activeTab: 1,
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
    this.setState({ outreach, completedTabs, disabledTabs, activeTab: 2 });
  };

  onOutReachNext = (trip) => {
    const { outreach } = this.state;
    let { area, route } = this.state;

    let error = 0;
    if (outreach === 'area') {
      if (trip.country === '') {
        Alert.alert('Error!!', 'Country is required');
        error += 1;
      } else if (trip.municipality === '') {
        Alert.alert('Error!!', 'Municipality is required');
        error += 1;
      }

      area = trip;
    }

    if (outreach === 'route') {
      if (typeof trip.start.name === 'undefined') {
        Alert.alert('Error!!', 'From is required');
        error += 1;
      } else if (typeof trip.end.name === 'undefined') {
        Alert.alert('Error!!', 'To is required');
        error += 1;
      }
      route = trip;
    }

    if (error === 0) {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(2);
      delete disabledTabs[disabledTabs.indexOf(2)];
      this.setState({ route, area, completedTabs, disabledTabs, activeTab: 3 });
    }
  };

  onAboutNext = (about) => {
    if (about.name === '') {
      Alert.alert('Error!!', 'Name is required');
    } else if (about.description === '') {
      Alert.alert('Error!!', 'Description is required');
    } else {
      const { completedTabs, disabledTabs } = this.state;
      completedTabs.push(3);
      delete disabledTabs[disabledTabs.indexOf(3)];
      this.setState({ about, completedTabs, disabledTabs, activeTab: 4 });
    }
  };

  onTypeNext = (type) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(4);
    delete disabledTabs[disabledTabs.indexOf(4)];
    this.setState({ type, completedTabs, disabledTabs, activeTab: 5 });
  };

  onShareAndPublishNext = (share) => {
    const { completedTabs, disabledTabs } = this.state;
    completedTabs.push(5);
    delete disabledTabs[disabledTabs.indexOf(5)];
    this.setState(
      {
        share, completedTabs, disabledTabs, activeTab: 6, loading: true,
      },
      this.createGroup,
    );
  };

  onButtonPress = () => {
    const { navigate } = this.props.navigation;
    navigate('Feed', { refetch: true });
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
          if (share.general.indexOf('copy_to_clip') > -1) {
            Clipboard.setString(res.data.group.url);
          }

          this.setState({ loading: false, group: res.data.group });
        })
        .catch(error => this.setState({ loading: false, error: error.message }));
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }

  renderFinish() {
    const { loading, error, group, share } = this.state;

    if (loading) {
      return (<Loading />);
    }

    if (error !== '') {
      return (<View>
        <Text>{error}</Text>
      </View>);
    }

    return (<Completed group={group} isCliped={share.general.indexOf('copy_to_clip') > -1} onButtonPress={this.onButtonPress} />);
  }

  render() {
    const { activeTab, completedTabs, disabledTabs } = this.state;
    const { navigation } = this.props;

    return (
      <Wrapper bgColor="#eded18">
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('@icons/icon_back.png')} style={styles.backIcon} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Container bgColor="#f3f3ed">
          <Text style={styles.mainTitle}>Add a new group</Text>
          <View style={styles.tabContainer}>
            <Tab
              label="Stretch"
              disabled={disabledTabs.indexOf(1) > -1}
              complete={completedTabs.indexOf(1) > -1}
              active={activeTab === 1}
            />
            <Tab
              label="Area"
              disabled={disabledTabs.indexOf(2) > -1}
              complete={completedTabs.indexOf(2) > -1}
              active={activeTab === 2}
            />
            <Tab
              label="About"
              disabled={disabledTabs.indexOf(3) > -1}
              complete={completedTabs.indexOf(3) > -1}
              active={activeTab === 3}
            />
            <Tab
              label="Open/Closed"
              disabled={disabledTabs.indexOf(4) > -1}
              complete={completedTabs.indexOf(4) > -1}
              active={activeTab === 4}
            />
            <Tab
              label="Invite"
              disabled={disabledTabs.indexOf(5) > -1}
              complete={completedTabs.indexOf(5) > -1}
              active={activeTab === 5}
            />
          </View>
          {(activeTab === 1) && <Stretch onNext={this.onStrechNext} />}
          {(activeTab === 2) &&
            <OutReach
              onNext={this.onOutReachNext}
              outreach={this.state.outreach}
            />}
          {(activeTab === 3) && <About onNext={this.onAboutNext} />}
          {(activeTab === 4) && <OpenClosed onNext={this.onTypeNext} />}
          {(activeTab === 5) && <Share showGroup={false} onNext={this.onShareAndPublishNext} />}
          {(activeTab === 6) && this.renderFinish()}
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
