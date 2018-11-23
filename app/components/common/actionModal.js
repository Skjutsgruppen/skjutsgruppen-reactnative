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
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: 12,
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
  calcleLabel: {
    fontFamily: 'SFUIText-Regular',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.text.blue,
  },
});

class ActionModal extends Component {
  state = {
    slideAnimationValue: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.timing(
      this.state.slideAnimationValue,
      {
        toValue: 1,
        duration: 800,
      },
    ).start();
  }

  // slideDown = () => {
  //   Animated.timing(this.state.slideAnimationValue, {
  //     toValue: 0,
  //     duration: 800,
  //   }).start();
  // }

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

    return (
      <Modal
        transparent={transparent}
        visible={visible}
        onRequestClose={this.close}
        animationType="slide"
      >
        <View style={[styles.modalContent, style]} >
          <View style={{ flex: 1, marginTop: slideStyle }}>
            <View
              animation="slideInUp"
              iterationCount={1}
              direction="alternate"
              duration={800}
              easing="ease-in-out-cubic"
              style={styles.actionsWrapper}
            >
              {
                title && title !== '' && <AppText centered fontVariation="bold" style={{ padding: 16 }}>{title}</AppText>
              }
              {this.renderActions()}
            </View>
            <View
              animation="slideInUp"
              iterationCount={1}
              direction="alternate"
              duration={620}
              easing="ease-in-out-cubic"
              style={styles.closeWrapper}
            >
              <TouchableHighlight
                style={styles.close}
                onPress={onRequestClose}
              >
                <Text style={styles.calcleLabel}>{trans('global.cancel')}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
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
