import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Button from '@components/experience/button';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 40,
    marginBottom: 30,
  },
  inputWrapper: {
    backgroundColor: Colors.background.fullWhite,
    elevation: 10,
    marginHorizontal: 24,
    borderRadius: 12,
    padding: '6%',
  },
  msg: {
    width: '80%',
    maxWidth: 300,
    textAlign: 'center',
    alignSelf: 'center',
    marginVertical: 50,
    fontSize: 16,
    color: '#000',
  },
  link: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 50,
  },
});

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  onPublish = () => {
    const { onPublish } = this.props;
    onPublish(this.state.text);
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.title}>Optional:</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            multiline
            autoFocus
            numberOfLines={10}
            onChangeText={text => this.setState({ text })}
            underlineColorAndroid="transparent"
            value={this.state.text}
          />
        </View>
        <Text style={styles.msg}>
          Friendly reminder: Experiences are public and may be
          used to show how are awesome our movement is
          (only in accordance with the <Text style={styles.link}>participant agreement</Text>,
          never something stupid :)). You are awesome!
        </Text>
        <View style={styles.actions}>
          <Button onPress={this.props.onBack} label="Back" icon="back" />
          <Button onPress={this.onPublish} label="Publish" />
        </View>
      </ScrollView>
    );
  }
}

Message.propTypes = {
  onPublish: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default Message;
