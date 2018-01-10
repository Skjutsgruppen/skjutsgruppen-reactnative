import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';
import Camera from '@components/camera';

const styles = StyleSheet.create({
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#dddddd',
  },
  addPhotoIcon: {
    width: 100,
    height: 64,
    resizeMode: 'contain',
    marginRight: 12,
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
  button: {
    marginBottom: 32,
    marginHorizontal: 24,
  },
});


class Description extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', photo: null };
  }

  componentWillMount() {
    const { text, photo } = this.props.defaultValue;
    this.setState({ text, photo });
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    const { avatar } = this.props.user;
    const { photo } = this.state;

    let profile = null;

    if (avatar) {
      profile = (<Image source={{ uri: avatar }} style={styles.profilePic} />);
    }

    return (
      <View>
        <Camera onSelect={res => this.setState({ photo: res.data })} defaultPhoto={photo}>
          <View style={styles.addPhoto}>
            <Image source={require('@icons/icon_add_photo.png')} style={styles.addPhotoIcon} />
            <View>
              <Text style={styles.addPhotoLabel}>Add a photo to your ride</Text>
              <Text style={styles.addPhotoLabelSmall}>Make your ride more visible</Text>
            </View>
          </View>
        </Camera>
        {profile}
        <Text style={styles.title}> Description</Text>
        <View>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={4}
            onChangeText={text => this.setState({ text })}
            underlineColorAndroid="transparent"
            defaultValue={this.state.text}
          />
        </View>
        <Text style={styles.infoText}>
          This is the most important part of our movement!
          <Text style={styles.bold}> We love to talk to each other! </Text>
          Write about who you are and where are you going. You can also include what
          vehicle you have, if you offer your seats for free or if you want to share the
          costs equally.
        </Text>
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.button}
        >
          Next
        </CustomButton>
      </View>
    );
  }
}

Description.propTypes = {
  user: PropTypes.shape({
    avatar: PropTypes.string,
  }).isRequired,
  defaultValue: PropTypes.shape({
    photo: PropTypes.string,
    text: PropTypes.string,
  }),
  onNext: PropTypes.func.isRequired,
};

Description.defaultProps = {
  defaultValue: {
    photo: null,
    text: '',
  },
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Description);
