import React, { Component } from 'react';
import { View, TextInput, Text, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import { FloatingNavbar, RoundedButton, Avatar, Loading } from '@components/common';
import { Colors } from '@theme';
import { withReport } from '@services/apollo/report';
import { propType } from 'graphql-anywhere/lib/src/utilities';
import { FEEDABLE_TRIP, FEED_TYPE_OFFER } from '@config/constant';
import Date from '@components/date';
import Toast from '@components/toast';
import { getToast } from '@config/toast';

const styles = {
  lightText: {
    color: Colors.text.gray,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Colors.background.mutedBlue,
  },
  content: {
    paddingVertical: 20,
    marginBottom: 50,
  },
  label: {
    color: Colors.text.pink,
    fontWeight: 'bold',
    marginBottom: 8,
    marginHorizontal: 20,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  avatar: {
    marginRight: 12,
  },
  descriptionWraper: {
    marginTop: 16,
  },
  input: {
    height: 140,
    padding: 20,
    backgroundColor: Colors.background.fullWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    marginBottom: 32,
    marginTop: 10,
  },
  infoWrapper: {
    paddingHorizontal: 20,
  },
  info: {
    paddingVertical: 14,
  },
  footer: {
    padding: 20,
    elevation: 10,
    backgroundColor: Colors.background.fullWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    marginBottom: 0,
  },
  thankyouContent: {
    paddingVertical: 20,
    marginBottom: 50,
  },
  thankyouText: {
    marginVertical: 12,
    marginHorizontal: 20,
  },
};

class Report extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { description: '', sending: false, isReported: false, error: '' };
  }

  onReport = () => {
    const { description } = this.state;
    const { navigation } = this.props;
    const { data, type } = navigation.state.params;

    if (!description) {
      this.setState({ error: getToast(['DESCRIPTION_REQUIRED']) });
      return null;
    }

    this.setState({ sending: true });

    const report = {
      description,
      reportable: type,
      reportableId: data.id,
    };

    return this.props.report(report)
      .then(() => this.setState({ isReported: true, sending: false }))
      .catch(err => this.setState({ error: getToast(err), sending: false }));
  }

  renderBodyText = () => {
    const { navigation } = this.props;
    const { data, type } = navigation.state.params;

    if (type === FEEDABLE_TRIP) {
      return (
        <View>
          <Text>{data.User.firstName} {data.type === FEED_TYPE_OFFER ? 'offers' : 'asks'} {data.seats !== 0 ? `${data.seats} seats` : 'for a ride'} </Text>
          <Text>{data.TripStart.name} - {data.TripEnd.name}</Text>
          <Date format="MMM DD, YYYY">{data.date}</Date>
        </View>
      );
    }

    return null;
  }

  renderButton = () => {
    if (this.state.sending) {
      return (<Loading />);
    }

    return (
      <RoundedButton
        onPress={this.onReport}
        bgColor={Colors.background.pink}
        style={styles.button}
      >
        Send
      </RoundedButton>
    );
  }

  render() {
    const { navigation, user } = this.props;

    if (!navigation.state.params) {
      return null;
    }

    const { data, type } = navigation.state.params;
    const { isReported, error } = this.state;

    return (
      <View style={styles.contentWrapper}>
        <FloatingNavbar handleBack={() => navigation.goBack()} title="Report" transparent={false} />
        {
          !isReported &&
          <ScrollView>
            <View style={styles.content}>
              <Text style={styles.label}>You are reporting this {type === FEEDABLE_TRIP ? 'ride' : type}:</Text>
              <View style={styles.body}>
                <Avatar source={{ uri: data.User.avatar }} size={60} style={styles.avatar} />
                <View>
                  {this.renderBodyText()}
                </View>
              </View>
              <View style={styles.descriptionWraper}>
                <Toast message={error} type="error" />
                <Text style={styles.label}>Why are you reporting?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Write"
                  placeholderTextColor={Colors.text.black}
                  onChangeText={description => this.setState({ description })}
                  multiline
                  underlineColorAndroid="transparent"
                  numberOfLines={4}
                  maxLength={100}
                />
              </View>
              <Text style={styles.label}>Information about you:</Text>
              <View style={styles.infoWrapper}>
                <View style={styles.info}>
                  <Text>Name</Text>
                  <Text>{user.firstName} {user.lastName}</Text>
                  <Text style={styles.lightText}>
                    Only visible for the one reviewing your report
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text>E-mail</Text>
                  <Text>{user.email}</Text>
                  <Text style={styles.lightText}>
                    Only visible for the one reviewing your report
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text>Phone</Text>
                  <Text>{user.phoneNumber}</Text>
                  <Text style={styles.lightText}>
                    Only visible for the one reviewing your report
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        }
        {
          isReported &&
          <View style={styles.thankyouContent}>
            <Text style={styles.label}>Thank you</Text>
            <Text style={styles.thankyouText}>
              If any action is taken you will get an e-mail.
            </Text>
            <Text style={styles.thankyouText}>
              Thank you for remembering that we are an non-profit movement.
                  We make this work with the help of volunteers and
                  all of you who help out with the self-sustaining garden.
                  Our volunteers work as fast as they can to get to your report.
            </Text>
            <Text style={styles.thankyouText}>Thanks for being a part of the movement!</Text>
          </View>
        }
        {
          !isReported &&
          <View style={styles.footer}>
            {this.renderButton()}
          </View>
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth.user });

Report.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.shape({
      params: PropTypes.shape({
        data: PropTypes.oneOfType([
          PropTypes.shape({
            id: PropTypes.number,
            TripStart: PropTypes.shape({
              name: PropTypes.string,
            }),
            TripEnd: PropTypes.shape({
              name: propType.string,
            }),
            User: PropTypes.shape({
              firstName: PropTypes.string,
              avatar: PropTypes.string,
            }),
            date: PropTypes.string,
          }),
          PropTypes.shape({
            id: PropTypes.number,
            text: PropTypes.string,
            User: PropTypes.shape({
              firstName: PropTypes.string,
              avatar: PropTypes.string,
            }),
          }),
        ]).isRequired,
        type: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  report: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
  }).isRequired,
};

export default compose(withReport, connect(mapStateToProps))(Report);
