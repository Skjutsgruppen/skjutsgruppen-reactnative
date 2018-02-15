import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';

import AddPhotoIconPink from '@assets/icons/ic_add_pink.png';
import AddPhotoIconBlue from '@assets/icons/ic_add_blue.png';
import CameraIcon from '@assets/icons/ic_camera_add.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: '10%',
  },
  imageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    width: 180,
    borderRadius: 90,
    backgroundColor: Colors.background.gray,
    padding: 24,
    overflow: 'hidden',
  },
  image: {
    height: 180,
    width: 180,
    borderRadius: 90,
    resizeMode: 'cover',
  },
  add: {
    position: 'absolute',
    bottom: 12,
    right: 0,
  },
  cross: {
    transform: [
      { rotate: '45deg' },
    ],
  },
  closeButton: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.red,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
});

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
    };
  }

  componentWillMount() {
    const { defaultPhoto } = this.props;
    if (defaultPhoto) {
      this.setState({ imageSource: { uri: `data:image/jpg;base64,${defaultPhoto}` } });
    }
  }

  removePhoto = () => {
    this.setState({ imageSource: null });
    this.props.onSelect({ data: '' });
  }

  selectOrRemove = () => {
    const { imageSource } = this.state;

    if (imageSource !== null) {
      this.removePhoto();
      return;
    }

    this.selectPhone();
  }

  selectPhone = () => {
    const options = {
      quality: 0.6,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        //
      } else if (response.error) {
        //
      } else if (response.customButton) {
        //
      } else {
        let source;
        const { onSelect } = this.props;
        onSelect(response);
        if (Platform.OS === 'android') {
          source = { uri: response.uri, isStatic: true };
        } else {
          source = { uri: response.uri.replace('file://', ''), isStatic: true };
        }
        this.setState({ imageSource: source });
      }
    });
  }

  renderPhoto() {
    const { imageSource } = this.state;

    if (imageSource === null) {
      return <Image source={CameraIcon} />;
    }

    return <Image style={styles.image} source={imageSource} />;
  }

  render() {
    const { iconColor } = this.props;
    const { imageSource } = this.state;
    let icon = AddPhotoIconPink;

    if (iconColor === 'blue') {
      icon = AddPhotoIconBlue;
    }

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {this.renderPhoto()}
          <TouchableOpacity
            onPress={this.selectOrRemove}
            style={[styles.add]}
          >
            {<View style={(imageSource !== null) && styles.cross}><Image source={icon} /></View>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Camera.propTypes = {
  onSelect: PropTypes.func.isRequired,
  defaultPhoto: PropTypes.string,
  iconColor: PropTypes.string,
};

Camera.defaultProps = {
  defaultPhoto: null,
  iconColor: null,
};

export default Camera;
