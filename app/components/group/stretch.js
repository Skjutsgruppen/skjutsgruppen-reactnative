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
    marginBottom: 24,
  },
  radioWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginHorizontal: '20%',
  },
  buttonWrapper: {
    padding: 8,
    marginBottom: 32,
    marginHorizontal: 24,
  },
});

class Stretch extends Component {
  constructor(props) {
    super(props);
    this.state = { outreach: 'route' };
  }

  setStretchType = (status) => {
    this.setState({ outreach: status });
  }

  render() {
    const { onNext } = this.props;
    const { outreach } = this.state;
    return (
      <View>
        <Text style={styles.title}>Stretch</Text>
        <Text style={styles.text}>
          Do your group have a specific stretch, good for commuting from point A to point B, or are
          you going different stretches?
        </Text>
        <View style={styles.radioWrapper}>
          <Radio onPress={() => this.setStretchType('route')} label="Specific stretch" checked={outreach === 'route'} />
          <Radio onPress={() => this.setStretchType('area')} label="Different stretches" checked={outreach === 'area'} />
        </View><View style={styles.buttonWrapper}>
          <Button
            onPress={() => onNext(outreach)}
            title="Next"
            accessibilityLabel="Go to next form"
            color="#38ad9e"
          />
        </View>
      </View>
    );
  }
}

Stretch.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Stretch;
