import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Colors from '@theme/colors';
import SectionLabel from '@components/add/sectionLabel';
import Radio from '@components/add/radio';
import { RoundedButton } from '@components/common';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: '5%',
  },
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
  radioRow: {
    paddingHorizontal: 20,
    paddingVertical: '5%',
  },
  radio: {
    marginBottom: 24,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
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
      <View style={styles.wrapper}>
        <SectionLabel label="Recurring ride?" />
        <View style={styles.radioRow}>
          <Radio
            active={outreach === STRETCH_TYPE_ROUTE}
            label="Specific stretch"
            onPress={this.setRouteType}
            style={styles.radio}
          />
          <Radio
            active={outreach === STRETCH_TYPE_AREA}
            label="Going to or from different places"
            onPress={this.setAreaType}
          />
        </View>
        <RoundedButton
          onPress={this.onPress}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Next
        </RoundedButton>
      </View>
    );
  }
}

Stretch.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Stretch;
