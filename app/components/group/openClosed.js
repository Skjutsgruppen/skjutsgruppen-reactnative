import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Radio from '@components/common/radio';
import Colors from '@theme/colors';
import CustomButton from '@components/common/customButton';
import { OPEN_GROUP, CLOSE_GROUP } from '@config/constant';
import { trans } from '@lang/i18n';

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
        <Text style={styles.title}>{trans('addGroup.open_closed')}</Text>
        <Text style={styles.text}>
          {trans('addGroup.is_group_for_everyone_to_join')}
        </Text>
        <View style={styles.radioWrapper}>
          <Radio onPress={this.onPressOpen} label={trans('addGroup.open_group')} checked={type === 'OpenGroup'} />
          <Radio onPress={this.onPressClosed} label={trans('addGroup.closed_group')} checked={type === 'ClosedGroup'} />
        </View>
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.buttonWrapper}
        >
          {trans('global.next')}
        </CustomButton>
        <Text style={[styles.text, styles.note]}>
          {trans('addGroup.please_note_rides_published')}
        </Text>
      </View>
    );
  }
}

OpenClosed.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default OpenClosed;
