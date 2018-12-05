import React, { Component, Children } from 'react';
import { StyleSheet, ScrollView, View, Text, Modal, ViewPropTypes, Animated } from 'react-native';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import { trans } from '@lang/i18n';
import { Colors } from '@theme';
import TouchableHighlight from '@components/touchableHighlight';
import { AppText } from '@components/utils/texts';
import reducers from '../../redux/reducers/reducers';

const styles = StyleSheet.create({
  horizontalDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.lightGray,
    paddingVertical: 16,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  backDrop: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    ...StyleSheet.absoluteFillObject,
  },
  actionsWrapper: {
    maxHeight: '70%',
    marginTop: 'auto',
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  closeWrapper: {
    height: 51,
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
  },
  close: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  cancelLabel: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text.blue,
  },
});

class ActionModal extends Component {
  state = {
    slideAnimationValue: new Animated.Value(0),
    fadeAnimationValue: new Animated.Value(0),
  }

  componentDidMount() {
    console.log('hello=============================');
    Animated.timing(
      this.state.fadeAnimationValue,
      {
        toValue: 1,
        duration: 400,
      },
    ).start();
    Animated.timing(
      this.state.slideAnimationValue,
      {
        toValue: 1,
        duration: 800,
      },
    ).start();
  }
  componentWillUpdate() {
    console.log('udpated=============================');
    Animated.timing(
      this.state.fadeAnimationValue,
      {
        toValue: 1,
        duration: 400,
      },
    ).start();
    Animated.timing(
      this.state.slideAnimationValue,
      {
        toValue: 1,
        duration: 800,
      },
    ).start();
  }


  componentWillUnmount() {
    console.log('unmoounted +===================');
  }

  // slideDown = () => {
  //   Animated.timing(this.state.slideAnimationValue, {
  //     toValue: 0,
  //     duration: 800,
  //   }).start();
  // }
  close = () => {
    const { onRequestClose } = this.props;
    Animated.timing(
      this.state.fadeAnimationValue,
      {
        toValue: 0,
        duration: 1200,
      },
    ).start();
    Animated.timing(
      this.state.slideAnimationValue,
      {
        toValue: 0,
        duration: 800,
      },
    ).start();
    setTimeout(() => {
      onRequestClose();
    }, 1200);
  }

  renderActions = () => {
    const childrenCount = Children.count(this.props.children);
    return (
      <ScrollView>
        {
          Children.map(this.props.children, (action, index) => (
            <View>
              {action}
              {
                (index !== childrenCount - 1) &&
                <View style={styles.horizontalDivider} />
              }
            </View>
          ))
        }
      </ScrollView>
    );
  }


  render() {
    const {
      title,
      style,
      transparent,
      visible,
      onRequestClose,
    } = this.props;

    const slideStyle = this.state.slideAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [800, 0],
      extrapolate: 'clamp',
    });

    const opacity = this.state.slideAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <Modal
        transparent={transparent}
        visible={visible}
        onRequestClose={this.close}
        animationType="none"
      >
        <Animated.View style={[styles.backDrop, { opacity }]} />
        <Animated.View style={[styles.modalContent, style, { marginTop: slideStyle }]} >
          <Animated.View style={{ flex: 1 }}>
            <View
              style={styles.actionsWrapper}
            >
              {
                title && title !== '' && <AppText centered fontVariation="bold" style={{ padding: 16 }}>{title}</AppText>
              }
              {this.renderActions()}
            </View>
            <View
              style={styles.closeWrapper}
            >
              <TouchableHighlight
                style={styles.close}
                onPress={this.close}
              >
                <Text style={styles.cancelLabel}>{trans('global.cancel')}</Text>
              </TouchableHighlight>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
}

ActionModal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
};

ActionModal.defaultProps = {
  title: null,
  style: {},
  transparent: true,
  visible: false,
};

export default ActionModal;
