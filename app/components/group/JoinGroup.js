import React, { Component } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Wrapper, NavBar, CustomButton, Loading } from '@components/common';
import Colors from '@theme/colors';
import GroupItem from '@components/feed/card/group';
import { withJoinGroup } from '@services/apollo/group';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 32,
  },
  text: {
    margin: 24,
    lineHeight: 20,
    color: '#333',
  },
  button: {
    marginHorizontal: 24,
    marginVertical: 12,
  },
  herderStyles: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
    borderRadius: 0,
  },
  stopText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.border.lightGray,
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
  msgWrapper: {
    padding: 24,
  },
  lightText: {
    color: Colors.text.gray,
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
      <CustomButton
        bgColor={Colors.background.green}
        style={styles.button}
        onPress={this.joinGroup}
      >
        Join the group
      </CustomButton>
    );
  }

  render() {
    const { group } = this.props;
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <GroupItem
          min
          onPress={() => { }}
          group={group}
          wrapperStyle={styles.herderStyles}
        />
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
        <Text style={styles.label}>About</Text>
        <Text style={styles.text}>
          {group.description}
        </Text>
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

