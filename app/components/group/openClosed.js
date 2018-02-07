import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Radio from '@components/add/radio';
import Colors from '@theme/colors';
import { RoundedButton } from '@components/common';
import SectionLabel from '@components/add/sectionLabel';
import { OPEN_GROUP, CLOSE_GROUP } from '@config/constant';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: '5%',
  },
  radioRow: {
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  radio: {
    marginBottom: 24,
  },
  infoText: {
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
    color: Colors.text.gray,
  },
  button: {
    alignSelf: 'center',
    width: '50%',
    marginTop: '15%',
    marginBottom: 80,
    marginHorizontal: 20,
  },
});

class OpenClosed extends Component {
  constructor(props) {
    super(props);

    this.state = { type: 'OpenGroup' };
  }

  onNext = () => {
    const { onNext } = this.props;
    const { type } = this.state;
    onNext(type);
  }

  onPressOpen = () => this.setType(OPEN_GROUP)

  onPressClosed = () => this.setType(CLOSE_GROUP)

  setType = (type) => {
    this.setState({ type });
  }

  render() {
    const { type } = this.state;

    return (
      <View style={styles.wrapper}>
        <SectionLabel label="Is your group open or closed?" />
        <View style={styles.radioRow}>
          <Radio
            active={type === OPEN_GROUP}
            label="Open (recommended)"
            onPress={this.onPressOpen}
            style={styles.radio}
          />
          <Radio
            active={type === CLOSE_GROUP}
            label="Closed"
            onPress={this.onPressClosed}
          />
        </View>
        <Text style={styles.infoText}>
          Please note that rides published in a closed group still will be
          searchable and joinable for everyone in the movement.
        </Text>
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Next
        </RoundedButton>
      </View>
    );
  }
}

OpenClosed.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default OpenClosed;
