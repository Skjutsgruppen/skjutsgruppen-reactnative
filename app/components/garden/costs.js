import React, { Component } from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { withNavigation } from 'react-navigation';

import { trans } from '@lang/i18n';
import { RoundedButton, CostCard } from '@components/common';
import { AppText, Title, Heading } from '@components/utils/texts';
import Colors from '@theme/colors';
import { withGardenInfo } from '@services/apollo/support';

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
    paddingVertical: 50,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    marginTop: 36,
    width: '100%',
    maxWidth: 200,
    alignSelf: 'center',
  },
  readMore: {
    paddingVertical: 16,
  },
});

class Costs extends Component {
  componentDidMount() {
    const { subscribeToSupportReceived } = this.props;

    subscribeToSupportReceived();
  }

  render() {
    const { showCostTitle, gardenInfo, navigation, showDescription, showReadMore, wrapperStyle } = this.props;
    if (!gardenInfo.data) return null;

    return (
      <View style={[styles.wrapper, wrapperStyle]}>
        {showCostTitle &&
          <View>
            <Title
              size={15}
              color={Colors.text.blue}
              style={{ marginBottom: 16 }}
            >OUR COSTS</Title>
            <Heading size={26} color={Colors.text.pink} style={{ lineHeight: 36 }}>
              The money goes to:
            </Heading>
          </View>
        }
        <CostCard title={trans('profile.server_cost')} coveredPercentage={gardenInfo.data.server} totalCost="2400" />
        <CostCard title={trans('profile.a_programmer')} coveredPercentage={gardenInfo.data.programmer} totalCost="18000" />
        <CostCard title={trans('profile.project_manager')} coveredPercentage={gardenInfo.data.projectManager} totalCost="10000" />
        <View style={styles.readMore}>
          {
            showDescription && (
              <AppText style={{ lineHeight: 26 }}>
                {trans('profile.we_will_fill_up_one_bar_at_the_time')}
              </AppText>
            )
          }
          { showReadMore &&
            <RoundedButton
              onPress={() => (showCostTitle ? navigation.navigate('SupportReadMore') : navigation.navigate('YourSupport'))}
              bgColor={Colors.background.pink}
              style={styles.button}
            >
              {trans('profile.read_more')}
            </RoundedButton>
          }
        </View>
      </View>
    );
  }
}

Costs.propTypes = {
  showCostTitle: PropTypes.bool,
  gardenInfo: PropTypes.shape({
    data: PropTypes.shape({
      server: PropTypes.number,
      programmer: PropTypes.number,
      projectManager: PropTypes.number,
    }),
  }).isRequired,
  subscribeToSupportReceived: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  showDescription: PropTypes.bool,
  showReadMore: PropTypes.bool,
  wrapperStyle: ViewPropTypes.style,
};

Costs.defaultProps = {
  supporter: false,
  showCostTitle: true,
  gardenInfo: {
    data: {
      server: 0,
      programmer: 0,
      projectManager: 0,
    },
  },
  showDescription: true,
  showReadMore: true,
  wrapperStyle: {},
};

export default compose(withGardenInfo, withNavigation)(Costs);
