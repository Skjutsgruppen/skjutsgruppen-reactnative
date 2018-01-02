import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@theme/colors';
import Radio from '@components/common/radio';
import CustomButton from '@components/common/customButton';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';

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
        <Text style={styles.title}>Stretch</Text>
        <Text style={styles.text}>
          Do your group have a specific stretch, good for commuting from point A to point B, or are
          you going different stretches?
        </Text>
        <View style={styles.radioWrapper}>
          <Radio onPress={this.setRouteType} label="Specific stretch" checked={outreach === STRETCH_TYPE_ROUTE} />
          <Radio onPress={this.setAreaType} label="Different stretches" checked={outreach === STRETCH_TYPE_AREA} />
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton onPress={this.onPress} bgColor={Colors.background.darkCyan}>
            Next
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
