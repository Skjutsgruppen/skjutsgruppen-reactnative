import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

const styles = StyleSheet.create({
  loader: {
    height: 80,
    flexDirection: 'row',
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: 'red',
    marginRight: 12,
  },
  detail: {
    flex: 1,
  },
  name: {
    height: 16,
    borderRadius: 2,
    backgroundColor: 'red',
    marginBottom: 6,
  },
  description: {
    height: 16,
    borderRadius: 2,
    backgroundColor: 'red',
  },
});

class CommentLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animValue: new Animated.Value(0),
    };
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.loader}>
          <View style={styles.avatar} />
          <View style={styles.detail}>
            <View style={styles.name} />
            <View style={styles.description} />
          </View>
        </View>
      </View>
    );
  }
}

export default CommentLoader;
