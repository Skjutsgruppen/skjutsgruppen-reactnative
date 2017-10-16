import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, ToastAndroid as Toast } from 'react-native';
import { submitComment, withTripComment } from '@services/apollo/comment';
import { Loading, Wrapper } from '@components/common';
import Comment from '@components/comment';
import Relation from '@components/relation';
import PropTypes from 'prop-types';

const OfferComment = withTripComment(Comment);

const styles = StyleSheet.create({
  lightText: {
    color: '#777777',
  },
  tab: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1db0ed',
  },
  feed: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 6,
    marginLeft: 6,
    marginBottom: 16,
    borderColor: '#cccccc',
    borderBottomWidth: 4,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  feedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  feedImg: {
    width: '100%',
  },
  imgIcon: {
    height: 55,
    width: 55,
    backgroundColor: '#ddd',
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  stopText: {
    color: '#00000077',
    marginTop: 16,
    marginBottom: 12,
  },
  messageText: {
    marginBottom: 16,
  },
  feedAction: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 2,
    borderColor: '#dddee3',
  },
  participantWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '33.33%',
  },
  verticalDevider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
  },
  footerContent: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    backgroundColor: '#f3f3ed',
    borderTopWidth: 2,
    borderColor: '#cececf',
    paddingVertical: 9,
    paddingLeft: 24,
    paddingRight: 12,
  },
  msgInput: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderColor: '#b1abab',
    paddingHorizontal: 12,
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.25,
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 36,
    marginRight: 12,
  },
  sendText: {
    color: '#00aeef',
    fontWeight: 'bold',
  },
});

class OfferDetail extends Component {
  static navigationOptions = {
    title: 'back',
  };

  constructor(props) {
    super(props);
    this.state = ({ loading: false, error: '', comment: '' });
  }

  onSubmit = () => {
    this.setState({ loading: true });
    const { submit, navigation } = this.props;
    const { comment } = this.state;
    const { offer } = navigation.state.params;
    const validation = this.checkValidation();

    if (validation.pass()) {
      try {
        submit(offer.id, null, comment).then(() => {
          Toast.show('comment added', Toast.LONG);
          this.setState({ comment: '', loading: false });
        }).catch((err) => {
          this.setState({ loading: false, error: err.message });
        });
      } catch (err) {
        this.setState({ loading: false, error: err.message });
      }
    } else {
      Toast.show(validation.errors.join('\n'), Toast.LONG);
      this.setState({ loading: false });
    }
  }

  checkValidation() {
    const errors = [];
    const { comment } = this.state;

    if (comment === '') {
      errors.push('Comment is required.');
    }

    return {
      pass: () => (errors.length === 0),
      errors,
    };
  }

  renderButton = () => {
    const { loading } = this.state;
    if (loading) {
      return (<View style={styles.loadingWrapper}><Loading /></View>);
    }
    return (
      <TouchableOpacity onPress={this.onSubmit}>
        <Text style={styles.sendText}> Send</Text>
      </TouchableOpacity>);
  }

  renderCommentForm() {
    return (
      <View>
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <TextInput
              onChangeText={comment => this.setState({ comment })}
              value={this.state.comment}
              style={styles.msgInput}
              placeholder="Write something..."
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'done'}
              placeholderTextColor="#666"
              underlineColorAndroid="transparent"
            />
            <View style={styles.send}>
              {this.renderButton()}
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { offer } = navigation.state.params;
    const { error } = this.state;

    let image = null;
    if (offer.photo) {
      image = (<Image source={{ uri: offer.photo }} style={{ width: '100%', height: 200 }} />);
    }

    let profileImage = null;
    if (offer.User.photo) {
      profileImage = (<Image source={{ uri: offer.User.photo }} style={styles.profilePic} />);
    } else {
      profileImage = (<View style={styles.imgIcon} />);
    }

    return (
      <View style={{ flex: 1 }}>
        <Wrapper>
          <View style={styles.feed}>
            <View style={styles.feedContent}>
              <View style={styles.feedTitle}>
                {profileImage}
                <View>
                  <Text style={styles.lightText}>
                    <Text style={styles.name}>
                      {offer.User.firstName || offer.User.email}
                    </Text>
                    <Text> offers {offer.seats} {offer.seats > 1 ? 'seats' : 'seat'} </Text>
                  </Text>
                  <Text>{offer.TripStart.name} - {offer.TripEnd.name}</Text>
                  <Text style={styles.lightText}>{offer.date}</Text>
                </View>
              </View>
              <View>
                {image}
                <View style={styles.info}>
                  <Text style={styles.stopText}>
                    Stops in
                    <Text> {offer.Stops.map(place => place.name).join(', ')}</Text>
                  </Text>
                  <Text style={styles.messageText}>{offer.comment}</Text>
                </View>
              </View>
            </View>
            <View style={styles.feedAction}>
              <Relation users={offer.User.relation} />
            </View>
            <View style={{ paddingTop: 20, paddingBottom: 70, backgroundColor: '#fff' }}>
              <OfferComment id={offer.id} />
            </View>
            {error !== '' && <View><Text>{error}</Text></View>}
          </View>
        </Wrapper>
        {this.renderCommentForm()}
      </View>
    );
  }
}

OfferDetail.propTypes = {
  submit: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default submitComment(OfferDetail);
