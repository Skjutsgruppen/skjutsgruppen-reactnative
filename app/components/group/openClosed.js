import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Button } from 'react-native';
import Radio from '@components/common/radio';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    fontSize: 11,
    color: '#777',
    lineHeight: 16,
    textAlign: 'center',
    marginHorizontal: '20%',
    marginBottom: 32,
  },
  radioWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginHorizontal: '20%',
  },
  buttonWrapper: {
    padding: 8,
    margin: 24,
  },
  note: {
    fontWeight: '500',
  },
});

class OpenClosed extends Component {
  constructor(props) {
    super(props);

    this.state = { type: 'open' };
  }

  onNext = () => {
    const { onNext } = this.props;
    const { type } = this.state;
    onNext(type);
  }

  setType = (type) => {
    this.setState({ type });
  }

  render() {
    const { type } = this.state;

    return (
      <View>
        <Text style={styles.title}>Open / Closed</Text>
        <Text style={styles.text}>Is your group open for everyone to join (recommended) or do you wish to moderate everyone who wants to join (you will then need to accept them to the group).</Text>
        <View style={styles.radioWrapper}>
          <Radio onPress={() => this.setType('open')} label="Open" checked={type === 'open'} />
          <Radio onPress={() => this.setType('closed')} label="Closed*" checked={type === 'closed'} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            onPress={this.onNext}
            title="Next"
            accessibilityLabel="Go to next form"
            color="#38ad9e"
          />
        </View>
        <Text style={[styles.text, styles.note]}>* Please note that rides published in a closed group still will be searchable and joinable for everyone in the movement. </Text>
      </View>
    );
  }
}

OpenClosed.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default OpenClosed;
