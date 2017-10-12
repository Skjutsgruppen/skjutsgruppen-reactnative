import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {},
  selectImage: {
    backgroundColor: 'white',
    padding: 8,
    width: 150,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 150,
  },
});

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
    };
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
      <View>
        <Image style={styles.image} source={this.state.imageSource} />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped}>
          <View style={[styles.imageContainer]}>
            {this.renderPhoto()}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

Camera.propTypes = {
  onSelect: PropTypes.func.isRequired,
  children: PropTypes.element,
  label: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  label: 'Select a Photo',
};

export default Camera;
