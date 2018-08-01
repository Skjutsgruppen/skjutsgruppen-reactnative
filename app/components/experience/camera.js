import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Camera from 'react-native-camera';
import ToolBar from '@components/utils/toolbar';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import { AppText } from '@components/utils/texts';

import CameraHead from '@assets/icons/ic_camera_head.png';
import CameraRear from '@assets/camera/ic_camera_rear_white.png';
import CameraFront from '@assets/camera/ic_camera_front_white.png';
import FlashAuto from '@assets/camera/ic_flash_auto_white.png';
import FlashOn from '@assets/camera/ic_flash_on_white.png';
import FlashOff from '@assets/camera/ic_flash_off_white.png';
import PropTypes from 'prop-types';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  cameraHead: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  viewFinder: {
    height: '60%',
    width: '100%',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actions: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  captureArea: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  message: {
    marginBottom: '8%',
  },
  captureButton: {
    height: 84,
    width: 84,
    borderRadius: 42,
    borderWidth: 10,
    borderColor: Colors.border.pink,
  },
  actionButton: {
    padding: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
});

class Cam extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      aspect: Camera.constants.Aspect.fill,
      captureTarget: Camera.constants.CaptureTarget.cameraRoll,
      type: Camera.constants.Type.front,
      orientation: Camera.constants.Orientation.auto,
      flashMode: Camera.constants.FlashMode.auto,
      loading: true,
      permissionDenied: false,
    };
  }

  componentWillMount() {
    this.grantCameraPermission();
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.type === back) {
      icon = CameraRear;
    } else if (this.state.type === front) {
      icon = CameraFront;
    }

    return icon;
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.flashMode === auto) {
      icon = FlashAuto;
    } else if (this.state.flashMode === on) {
      icon = FlashOn;
    } else if (this.state.flashMode === off) {
      icon = FlashOff;
    }

    return icon;
  }


  takePicture = () => {
    if (this.camera) {
      this.camera.capture(
        {
          target: Camera.constants.CaptureTarget.disk,
          forceUpOrientation: true,
          fixOrientation: true,
        },
      )
        .then(this.props.takePicture);
    }
  }

  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.type === back) {
      newType = front;
    } else if (this.state.type === front) {
      newType = back;
    }

    this.setState({ type: newType });
  }

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({ flashMode: newFlashMode });
  }

  grantCameraPermission = async () => {
    try {
      if (Platform === 'ios' || Platform.OS === 'ios') {
        const permission = await Camera.checkDeviceAuthorizationStatus();
        this.setState({ loading: false, permissionDenied: !permission });
      } else {
        const cameraGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA);
        const interalStorageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        const externalStorageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED
          && interalStorageGranted === PermissionsAndroid.RESULTS.GRANTED
          && externalStorageGranted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({ loading: false, permissionDenied: false });
        } else {
          this.setState({ loading: false, permissionDenied: true });
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  initializeCamera = () => {
    const { permissionDenied } = this.state;
    if (permissionDenied) {
      return (
        <View style={[styles.viewFinder, { backgroundColor: '#000' }]} />);
    }
    return (
      <View style={styles.viewFinder}>
        {this.renderCamera()}
        <View style={styles.actions}>
          {this.renderCameraType()}
          {this.renderFlash()}
        </View>
      </View>
    );
  }

  renderCamera = () => (
    <Camera
      ref={(cam) => {
        this.camera = cam;
      }}
      captureQuality={Camera.constants.CaptureQuality.medium}
      style={styles.preview}
      aspect={this.state.aspect}
      captureTarget={this.state.captureTarget}
      type={this.state.type}
      flashMode={this.state.flashMode}
      onFocusChanged={() => { }}
      onZoomChanged={() => { }}
      defaultTouchToFocus
      mirrorImage={false}
    />
  );

  renderCameraType = () => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={this.switchType}
    >
      <Image
        source={this.typeIcon}
      />
    </TouchableOpacity>
  );

  renderFlash = () => (<TouchableOpacity
    style={styles.actionButton}
    onPress={this.switchFlash}
  >
    <Image
      source={this.flashIcon}
    />
  </TouchableOpacity>);

  renderCapureButton = () => {
    const { permissionDenied } = this.state;
    if (permissionDenied) {
      return (
        <TouchableOpacity onPress={this.grantCameraPermission} >
          <View style={styles.captureButton} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={this.takePicture} >
        <View style={styles.captureButton} />
      </TouchableOpacity>
    );
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <View style={styles.wrapper}>
          <Loading />
        </View>);
    }

    return (
      <View style={styles.container}>
        <ToolBar transparent />
        <Image source={CameraHead} style={styles.cameraHead} />
        {this.initializeCamera()}
        <View style={styles.captureArea}>
          <AppText centered style={styles.message}>
            {trans('experience.show_everyone_participating_in_this_ride')}
          </AppText>
          {this.renderCapureButton()}
        </View>
      </View>
    );
  }
}

Cam.propTypes = {
  takePicture: PropTypes.func.isRequired,
};

export default Cam;
