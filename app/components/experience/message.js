import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import Button from '@components/experience/button';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  title: {
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
        <AppText centered style={styles.title}>{trans('experience.optional')}:</AppText>
        <View style={styles.inputWrapper}>
          <TextInput
            multiline
            autoFocus
            numberOfLines={10}
            onChangeText={text => this.setState({ text })}
            underlineColorAndroid="transparent"
            value={this.state.text}
            style={{ fontFamily: 'SFUIText-Regular' }}
          />
        </View>
        <AppText style={styles.msg}>
          {trans('experience.friendly_reminder')} <AppText color={Colors.text.blue} fontVariation="bold">{trans('experience.participant_agreement')}</AppText>,
          {trans('experience.never_something_stupid')}
        </AppText>
        <View style={styles.actions}>
          <Button onPress={this.props.onBack} label={trans('experience.back')} icon="back" />
          <Button onPress={this.onPublish} label={trans('experience.publish')} />
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
