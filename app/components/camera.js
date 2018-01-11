import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 24,
    elevation: 10,
  },
  selectImage: {
    backgroundColor: 'white',
    padding: 8,
    width: 150,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
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

  selectPhotoTapped = () => {
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
    const { children, label } = this.props;

    if (imageSource === null) {
      if (children) {
        return children;
      }

      return (<Text style={styles.selectImage}>{label}</Text>);
    }

    return (
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={this.state.imageSource} />
      </View>
    );
  }

  renderRemoveButton() {
    if (this.state.imageSource) {
      return (
        <TouchableOpacity onPress={this.removePhoto} style={styles.closeButton}>
          <Icon
            name="ios-close"
            size={32}
            style={{ color: '#fff' }}
          />
        </TouchableOpacity>
      );
    }

    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped}>
          <View>
            {this.renderPhoto()}
          </View>
        </TouchableOpacity>
        {this.renderRemoveButton()}
      </View>
    );
  }
}

Camera.propTypes = {
  onSelect: PropTypes.func.isRequired,
  children: PropTypes.element,
  label: PropTypes.string,
  defaultPhoto: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  label: 'Select a Photo',
  defaultPhoto: null,
};

export default Camera;
