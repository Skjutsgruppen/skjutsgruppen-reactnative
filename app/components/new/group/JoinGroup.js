import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { withJoinGroup } from '@services/apollo/group';
import { Wrapper, CustomButton, Loading } from '@components/common';
import { Navbar } from '@components/new/common';
import Colors from '@theme/colors';
import GroupImage from './groupImage';
import Participants from './participants';

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
    marginTop: 16,
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
    color: Colors.text.darkGray,
  },
  description: {
    marginTop: 24,
  },
  msgWrapper: {
    padding: 24,
  },
  lightText: {
    color: Colors.text.gray,
  },
  whitebg: {
    backgroundColor: Colors.background.fullWhite,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.fullWhite,
    shadowOffset: { width: 0, height: -4 },
    shadowColor: Colors.background.balck,
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});

class JoinGroup extends Component {
  constructor(props) {
    super(props);
    this.state = ({ loading: false, isPending: false, group: {}, requestSent: false });
  }

  componentWillMount() {
    const { group, user } = this.props;
    let isPending = false;

    group.GroupMembershipRequests.forEach((request) => {
      if (request.Member.id === user.id && request.status === 'pending') {
        isPending = true;
      }
    });

    this.setState({ group, isPending });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  joinGroup = () => {
    const { group } = this.state;
    const { submit, refresh } = this.props;

    this.setState({ loading: true }, () => submit(group.id).then(refresh).then(() => {
      if (group.type === 'ClosedGroup') {
        this.setState({ requestSent: true, loading: false });
      }
    }));
  }

  renderButton = () => {
    const { loading, requestSent, isPending } = this.state;

    if (loading) {
      return (
        <View style={styles.msgWrapper}>
          <Loading />
        </View>
      );
    }

    if (requestSent) {
      return (
        <View style={styles.msgWrapper}>
          <Text style={styles.lightText}>Request has been sent</Text>
        </View>
      );
    }

    if (isPending) {
      return (
        <View style={styles.msgWrapper}>
          <Text style={styles.lightText}>Your Request is pending.</Text>
        </View>
      );
    }

    return (
      <View style={styles.footer}>
        <CustomButton
          bgColor={Colors.background.green}
          style={styles.button}
          onPress={this.joinGroup}
        >
          Join the group
        </CustomButton>
      </View>
    );
  }

  render() {
    const { group } = this.props;

    return (
      <Wrapper bgColor={Colors.background.fullWhite}>
        <Navbar handleBack={this.goBack} showShare />
        <ScrollView>
          <GroupImage imageURI={group.photo} name={group.name} />
          <Text style={styles.sectionTitle}>{'Participants'.toUpperCase()}</Text>
          <Participants members={group.GroupMembers} />
          <Text style={[styles.sectionTitle, styles.aboutTitle]}>{'About'.toUpperCase()}</Text>
          <Text style={styles.text}>
            {
              group.type === 'OpenGroup' && 'Open Group'
            }
            {
              group.type === 'ClosedGroup' && 'Closed Group'
            }
          </Text>
          <Text style={styles.text}>
            {
              group.outreach === 'area' && [group.country, group.county, group.municipality, group.locality].filter(s => s).join(', ')
            }
            {
              group.outreach === 'route' && `${group.TripStart.name} - ${group.TripEnd.name}`
            }
          </Text>
          {
            group.Stops.length > 0 &&
            <View style={styles.stopText}>
              <Image source={require('@icons/icon_stops.png')} style={styles.stopsIcon} />
              <Text style={styles.lightText}>
                Stops in
              <Text style={styles.stops}> {group.Stops.map(place => place.name).join(', ')}</Text>
              </Text>
            </View>
          }
          <Text style={[styles.text, styles.description]}>
            {group.description}
          </Text>
        </ScrollView>
        {this.renderButton()}
      </Wrapper>
    );
  }
}

JoinGroup.propTypes = {
  submit: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  group: PropTypes.shape({
    GroupMembershipRequests: PropTypes.array.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withJoinGroup, connect(mapStateToProps))(JoinGroup);

