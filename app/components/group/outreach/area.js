import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Picker } from 'react-native';
import Colors from '@theme/colors';
import { Loading, RoundedButton } from '@components/common';
import { compose } from 'react-apollo';
import { withCounties, withMunicipalities, withLocalities } from '@services/apollo/location';
import countries from '@config/countries';
import LocationList from '@components/group/outreach/locationList';
import { DEFAULT_COUNTRY_CODE } from '@config/constant';
import SectionLabel from '@components/add/sectionLabel';
import { AppText } from '@components/utils/texts';

const Municipality = withMunicipalities(LocationList);
const Locality = withLocalities(LocationList);
const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
    marginHorizontal: 20,
  },
});

class Area extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: DEFAULT_COUNTRY_CODE,
      county: null,
      municipality: null,
      locality: null,
    };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    const { country, county, municipality, locality } = defaultValue;

    this.setState({ country, county, municipality, locality });
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
    if (county === null || county === '') {
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

    if (municipality === null || municipality === '') {
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
    if (this.state.country !== DEFAULT_COUNTRY_CODE) {
      return (
        <View>
          <AppText size={14} color={Colors.text.gray} style={{ margin: 24 }}>
            We do not have counties, municipalities and places for the country you have choosen.
            Would you like to help us with adding this?
            E-mail us at samarbeta@skjutsgruppen.nu and we will do this together
          </AppText>
        </View>
      );
    }

    return (
      <View>
        <View>
          <SectionLabel label="County" />
          {this.renderCounties()}
        </View>
        <View>
          <SectionLabel label="Municipality" />
          {this.renderMunicipality()}
        </View>
        <View>
          <SectionLabel label="Locality" />
          {this.renderLocality()}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View>
        <View>
          <SectionLabel label="Country" />
          <Picker
            style={styles.input}
            selectedValue={this.state.country}
            onValueChange={country =>
              this.setState({ country, county: null, municipality: null, locality: null })
            }
          >
            {this.renderCountryCode()}
          </Picker>
        </View>

        {this.renderAddress()}

        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          {this.props.buttonLabel}
        </RoundedButton>
      </View>
    );
  }
}

Area.propTypes = {
  onNext: PropTypes.func.isRequired,
  countyLoading: PropTypes.bool.isRequired,
  counties: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultValue: PropTypes.shape({
    country: PropTypes.string,
    county: PropTypes.number,
    municipality: PropTypes.number,
    locality: PropTypes.number,
  }).isRequired,
  buttonLabel: PropTypes.string,
};

Area.defaultProps = {
  buttonLabel: 'Next',
};

export default compose(withCounties)(Area);
