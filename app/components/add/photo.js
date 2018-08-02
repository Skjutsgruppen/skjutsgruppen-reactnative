import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Alert,
  Modal,
  Text,
} from 'react-native';
// import { compose } from 'react-apollo';

import { withNavigation } from 'react-navigation';

import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

import { AppText } from '@components/utils/texts';

import Colors from '@theme/colors';

import TouchableHighlight from '@components/touchableHighlight';

import AddPhotoIconPink from '@assets/icons/ic_add_pink.png';
import AddPhotoIconBlue from '@assets/icons/ic_add_blue.png';
import Curves from '@assets/ic_wavy_header.png';

import CameraIcon from '@assets/icons/ic_camera_add.png';
import { trans } from '@lang/i18n';
import { green, hidden } from 'ansi-colors';
import { RoundedButton } from '../common';


const imageSize = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginVertical: '10%',
  },
  supporterModalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  supporterModalCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 40,
    borderRadius: 30,
    paddingBottom: 60,
    paddingTop: 120,
    overflow: 'hidden',
  },
  curves: {
    position: 'absolute',
    top: 0,
    marginTop: -20,
  },
  button: {
    width: 200,
    marginBottom: 0,
  },
  seperator: {
    backgroundColor: 'rgb(229,229,229)',
    height: 1,
    width: 124,
    marginTop: 54,
    marginBottom: 46,
  },
  cameraWrapper: {
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize / 2,
    overflow: 'hidden',
  },
  camera: {
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize / 2,
    backgroundColor: Colors.background.gray,
    padding: 24,
  },
  image: {
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize / 2,
    resizeMode: 'cover',
  },
  addWrapper: {
    position: 'absolute',
    bottom: 12,
    right: 0,
    height: 42,
    width: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  addIcon: {
    maxHeight: 42,
    maxWidth: 42,
    resizeMode: 'contain',
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
      showSupporterModal: false,
    };
    this.imagePickerDisplayed = false;
  }

  componentWillMount() {
    const { defaultPhoto } = this.props;
    if (defaultPhoto) {
      this.setState({ imageSource: { uri: `data:image/jpg;base64,${defaultPhoto}` } });
    }
  }

  setModalVisible(visible) {
    this.setState({ showSupporterModal: visible });
  }

  handleNagivation = (visible) => {
    const { navigation } = this.props;
    this.setState({ showSupporterModal: visible });
    navigation.navigate('Garden');
  }

  removePhoto = () => {
    this.setState({ imageSource: null });
    this.props.onSelect({ data: '' });
    this.imagePickerDisplayed = false;
  }

  showSupporter = () => {
    this.setState({ showSupporterModal: true });
  }

  selectOrRemove = () => {
    const { canAddPhoto } = this.props;
    const { imageSource } = this.state;

    if (!canAddPhoto) {
      this.showSupporter();
      return;
    }

    if (imageSource !== null) {
      this.removePhoto();
      return;
    }

    if (!this.imagePickerDisplayed) {
      this.selectPhone();
    }
  }

  selectPhone = () => {
    const options = {
      quality: 0.6,
      storageOptions: {
        skipBackup: true,
      },
    };

    this.imagePickerDisplayed = true;
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        this.imagePickerDisplayed = false;
      } else if (response.error) {
        this.imagePickerDisplayed = false;
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
      return (
        <View style={styles.cameraWrapper}>
          <TouchableHighlight style={styles.camera} onPress={this.selectOrRemove}>
            <Image source={CameraIcon} />
          </TouchableHighlight>
        </View>
      );
    }

    return <Image style={styles.image} source={imageSource} />;
  }

  render() {
    const { iconColor } = this.props;
    const { imageSource, showSupporterModal } = this.state;
    let icon = AddPhotoIconPink;

    if (iconColor === 'blue') {
      icon = AddPhotoIconBlue;
    }

    return (
      <View style={styles.container}>
        <View>
          <Modal
            animationType="slide"
            transparent
            visible={showSupporterModal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}
          >
            <View style={[styles.supporterModalWrapper, { backgroundColor: 'rgba(255, 255, 255, 0.6)' }]}>
              <View style={styles.supporterModalCard}>
                <Image source={Curves} style={styles.curves} />
                <AppText color={Colors.text.pink} size={26} fontVariation="bold" style={{ marginBottom: 48 }}>
                  {trans('add.support_the_garden_to_add_a_photo')}
                </AppText>
                <RoundedButton
                  onPress={() => this.handleNagivation(!showSupporterModal)}
                  bgColor={Colors.background.pink}
                  style={styles.button}
                >
                  {trans('feed.read_more')}
                </RoundedButton>
                <View style={styles.seperator} />
                <AppText style={{ marginBottom: 30 }}>{trans('add.you_dont_have_to_though')} :-)</AppText>
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!showSupporterModal);
                  }}
                >
                  <AppText color={Colors.text.blue}>
                    {trans('add.continue_without_photo')}
                  </AppText>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.imageContainer}>
          {this.renderPhoto()}
          <View style={styles.addWrapper}>
            <TouchableHighlight
              onPress={this.selectOrRemove}
            >
              {
                <View style={(imageSource !== null) && styles.cross}>
                  <Image source={icon} style={styles.addIcon} />
                </View>
              }
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

Camera.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  defaultPhoto: PropTypes.string,
  iconColor: PropTypes.string,
  canAddPhoto: PropTypes.bool,
};

Camera.defaultProps = {
  defaultPhoto: null,
  iconColor: null,
  canAddPhoto: true,
};

export default withNavigation(Camera);
