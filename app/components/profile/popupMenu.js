import React, { Component } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  popupMenu: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 24,
    right: 24,
    height: 0,
    width: 0,
    paddingVertical: 8,
    zIndex: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 12,
  },
  content: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});

class PopupMenu extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      popupAnim: new Animated.ValueXY({ x: 0, y: 0 }),
    });
    this.show = Animated.timing(this.state.popupAnim, {
      toValue: { x: 160, y: 80 },
      duration: 150,
    });
    this.hide = Animated.timing(this.state.popupAnim, {
      toValue: { x: 0, y: 0 },
      duration: 150,
    });
  }

  componentDidMount = () => {
    this.show.start();
  }

  componentWillUnmount = () => {
    this.hide.start();
  }

  render() {
    const popupStyle = {
      // opacity: this.state.popupAnim.o,
      height: this.state.popupAnim.y,
      width: this.state.popupAnim.x,
    };

    return (
      <Animated.View style={[styles.popupMenu, popupStyle]}>
        <View style={styles.content}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}

PopupMenu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default PopupMenu;
