import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Picker } from 'react-native';
import Colors from '@theme/colors';
import CustomButton from '@components/common/customButton';
import { Loading } from '@components/common';
import { compose } from 'react-apollo';
import { withCounties, withMunicipalities, withLocalities } from '@services/apollo/auth';
import countries from '@config/countries';
import LocationList from '@components/group/outreach/locationList';

const Municipality = withMunicipalities(LocationList);
const Locality = withLocalities(LocationList);

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',

  },
  label: {
    color: '#777',
    marginBottom: 6,
    marginHorizontal: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  buttonWrapper: {
    padding: 8,
    margin: 24,
  },
  text: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    margin: 24,
    color: Colors.text.gray,
  },
  bold: {
    fontWeight: 'bold',
  },
  optional: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#777',
    fontStyle: 'italic',
  },
});

class Area extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: 'SE',
      county: null,
      municipality: null,
      locality: null,
    };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  renderCountryCode = () => countries.map(country => (
    <Picker.Item
      key={country.code}
      label={country.name}
      value={country.code}
    />
  ));

  renderCounties = () => {
    const { countyLoading, counties } = this.props;

    if (countyLoading) {
      return <Loading />;
    }

    const node = counties.map(county => (
      <Picker.Item
        key={county.id}
        label={county.name}
        value={county.id}
      />
    ));

    return (<Picker
      style={styles.input}
      selectedValue={this.state.county}
      onValueChange={county => this.setState({ county, municipality: null, locality: null })}
    >
      {[<Picker.Item
        label="Select"
        value=""
        key="0"
      />].concat(node)}
    </Picker>);
  }

  renderMunicipality = () => {
    const { county } = this.state;
    if (county === null) {
      return null;
    }

    return (
      <Municipality
        style={styles.input}
        countyId={county}
        selectedValue={this.state.municipality}
        onValueChange={(municipality) => {
          this.setState({ municipality });
        }}
      />
    );
  }

  renderLocality = () => {
    const { municipality } = this.state;

    if (municipality === null) {
      return null;
    }

    return (
      <Locality
        style={styles.input}
        municipalityId={municipality}
        selectedValue={this.state.locality}
        onValueChange={locality => this.setState({ locality })}
      />
    );
  }


  renderAddress = () => {
    if (this.state.country !== 'SE') {
      return (
        <View>
          <Text style={styles.infoText}>
            {`We don't have counties, municipalities and places for the
            country you have choosen. Would you like to help us with adding this?
            E-mail us at samarbeta@skjutsgruppen.nu and we'll do this together`}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <View>
          <Text style={styles.label}>County, <Text style={styles.optional}>optional</Text></Text>
          {this.renderCounties()}
        </View>
        <View>
          <Text style={styles.label}>Municipality</Text>
          {this.renderMunicipality()}
        </View>
        <View>
          <Text style={styles.label}>Locality, <Text style={styles.optional}>optional</Text></Text>
          {this.renderLocality()}
        </View>
      </View>
    );
  }
  render() {
    return (
      <View>
        <Text style={styles.title}>Area Different stretchs</Text>
        <Text style={styles.text}>This groups is based in:</Text>
        <View>
          <Text style={styles.label}>Country</Text>
          <Picker
            style={styles.input}
            selectedValue={this.state.country}
            onValueChange={country => this.setState({ country })}
          >
            {this.renderCountryCode()}
          </Picker>
        </View>

        {this.renderAddress()}

        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.buttonWrapper}
        >
          Next
        </CustomButton>
      </View>
    );
  }
}

Area.propTypes = {
  onNext: PropTypes.func.isRequired,
  countyLoading: PropTypes.bool.isRequired,
  counties: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default compose(withCounties)(Area);
