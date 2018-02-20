import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import SectionLabel from '@components/add/sectionLabel';
import Radio from '@components/add/radio';
import { STRETCH_TYPE_ROUTE, STRETCH_TYPE_AREA } from '@config/constant';
import Route from '@components/group/outreach/route';
import Area from '@components/group/outreach/area';

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
});

class Stretch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { outreach: STRETCH_TYPE_ROUTE };
  }

  onNext = (trip) => {
    const { onNext } = this.props;
    const { outreach } = this.state;
    onNext({ outreach, trip });
  }

  renderOutReach = () => {
    if (this.state.outreach === STRETCH_TYPE_ROUTE) {
      return (<Route onNext={this.onNext} />);
    }

    return (<Area onNext={this.onNext} />);
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
            onPress={() => this.setState({ outreach: STRETCH_TYPE_ROUTE })}
            style={styles.radio}
          />
          <Radio
            active={outreach === STRETCH_TYPE_AREA}
            label="Going to or from different places"
            onPress={() => this.setState({ outreach: STRETCH_TYPE_AREA })}
          />
        </View>
        {this.renderOutReach()}
      </View>
    );
  }
}

Stretch.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default Stretch;
