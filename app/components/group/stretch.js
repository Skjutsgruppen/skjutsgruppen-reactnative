import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@theme/colors';
import Radio from '@components/common/radio';
import CustomButton from '@components/common/customButton';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';
import { trans } from '@lang/i18n';

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
    marginBottom: 24,
  },
  radioWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginHorizontal: '20%',
  },
  buttonWrapper: {
    marginTop: 32,
    marginHorizontal: 20,
  },
});

class Stretch extends Component {
  constructor(props) {
    super(props);
    this.state = { outreach: STRETCH_TYPE_ROUTE };
  }

  onPress = () => {
    const { onNext } = this.props;
    const { outreach } = this.state;
    onNext(outreach);
  }

  setRouteType = () => {
    this.setState({ outreach: STRETCH_TYPE_ROUTE });
  }

  setAreaType = () => {
    this.setState({ outreach: STRETCH_TYPE_AREA });
  }

  render() {
    const { outreach } = this.state;
    return (
      <View>
        <Text style={styles.title}>{trans('addGroup.stretch')}</Text>
        <Text style={styles.text}>
          {trans('addGroup.have_specific_stretch')}
        </Text>
        <View style={styles.radioWrapper}>
          <Radio onPress={() => this.setStretchType('route')} label={trans('addGroup.specific_stretch')} checked={outreach === 'route'} />
          <Radio onPress={() => this.setStretchType('area')} label={trans('addGroup.different_stretches')} checked={outreach === 'area'} />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton onPress={() => onNext(outreach)} bgColor={Colors.background.darkCyan}>
            {trans('global.next')}
          </CustomButton>
        </View>
      </View>
    );
  }
}

Stretch.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Stretch;
