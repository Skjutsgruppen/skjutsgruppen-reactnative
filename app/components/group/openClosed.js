import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Radio from '@components/common/radio';
import Colors from '@theme/colors';
import CustomButton from '@components/common/customButton';
import { OPEN_GROUP, CLOSE_GROUP } from '@config/constant';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  text: {
    color: '#777',
    lineHeight: 20,
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
    fontSize: 12,
    lineHeight: 16,
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
      <View>
        <Text style={styles.title}>Open / Closed</Text>
        <Text style={styles.text}>
          Is your group open for everyone to join (recommended) or
          do you wish to moderate everyone who wants to join (you will then need to accept
          them to the group).
        </Text>
        <View style={styles.radioWrapper}>
          <Radio onPress={this.onPressOpen} label="OpenGroup" checked={type === OPEN_GROUP} />
          <Radio onPress={this.onPressClosed} label="ClosedGroup" checked={type === CLOSE_GROUP} />
        </View>
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.buttonWrapper}
        >
          Next
        </CustomButton>
        <Text style={[styles.text, styles.note]}>
          * Please note that rides published in a closed group still will be
          searchable and joinable for everyone in the movement.
        </Text>
      </View>
    );
  }
}

OpenClosed.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default OpenClosed;
