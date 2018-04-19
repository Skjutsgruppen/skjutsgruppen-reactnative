import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Radio from '@components/add/radio';
import Colors from '@theme/colors';
import { RoundedButton } from '@components/common';
import SectionLabel from '@components/add/sectionLabel';
import { OPEN_GROUP, CLOSE_GROUP } from '@config/constant';
import { trans } from '@lang/i18n';

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
    this.state = { type: OPEN_GROUP };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({ type: defaultValue });
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
        <SectionLabel label={trans('add.is_open_or_closed')} />
        <View style={styles.radioRow}>
          <Radio
            active={type === OPEN_GROUP}
            label={trans('add.open_recommended')}
            onPress={this.onPressOpen}
            style={styles.radio}
          />
          <Radio
            active={type === CLOSE_GROUP}
            label={trans('add.closed')}
            onPress={this.onPressClosed}
          />
        </View>
        <Text style={styles.infoText}>
          {trans('add.rides_published_in_closed_group_still')}
        </Text>
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          {trans('global.next')}
        </RoundedButton>
      </View>
    );
  }
}

OpenClosed.propTypes = {
  onNext: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
};

export default OpenClosed;
