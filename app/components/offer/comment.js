import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Camera from '../camera';

const styles = StyleSheet.create({
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#dddddd',
  },
  addPhotoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  addPhotoLabelSmall: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  textarea: {
    height: 100,
    backgroundColor: '#ffffff',
    borderWidth: 0,
    padding: 12,
    marginVertical: 16,

  },
  infoText: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginHorizontal: 24,
  },
});


class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', photo: '' };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    const { photo } = this.props.user;
    let profile = null;

    if (photo) {
      profile = (<Image source={{ uri: photo }} style={styles.profilePic} />);
    }

    return (
      <View>
        <View style={styles.addPhoto}>
          <Camera onSelect={res => this.setState({ photo: res.data })}>
            <View>
              <Text style={styles.addPhotoLabel}>Add a photo to your ride</Text>
              <Text style={styles.addPhotoLabelSmall}>Make your ride more visible</Text>
            </View>
          </Camera>
        </View>

        {profile}

        <Text style={styles.title}> Comment</Text>
        <View>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={4}
            onChangeText={text => this.setState({ text })}
            underlineColorAndroid="transparent"
            value={this.state.text}
          />
        </View>
        <Text style={styles.infoText}>
          This is the most important part of our movement!
          <Text style={styles.bold}> We love to talk to each other! </Text>
          Write about who you are and where are you going. You can also include what vehicle you have, if you
                    offer your seats for free or if you want to share the costs equally.
        </Text>
        <View style={styles.buttonWrapper}>
          <Button
            onPress={this.onNext}
            title="Next"
            accessibilityLabel="Go to next form"
            color="#38ad9e"
          />
        </View>
      </View>
    );
  }
}

Comment.propTypes = {
  onNext: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Comment);
