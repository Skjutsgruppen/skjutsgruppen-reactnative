import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Wrapper, NavBar } from '@components/common';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import { withMyGroups } from '@services/apollo/group';
import ActiveGroupItem from '@components/message/ActiveGroupItem';

const styles = StyleSheet.create({
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    paddingVertical: 12,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  messages: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  spacedWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  footer: {
    marginVertical: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CED0CE',
  },
});

class ActiveGroupList extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderActiveGroups = () => {
    const { groups } = this.props;

    return (
      <DataList
        data={groups}
        renderItem={({ item }) => (<ActiveGroupItem group={item} />)}
        fetchMoreOptions={{
          variables: { offset: groups.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.groups.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.groups.rows.concat(
              fetchMoreResult.groups.rows,
            );

            return { groups: { ...previousResult.groups, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.messages}>
          <Text style={styles.sectionTitle}>
            YOUR GROUPS
          </Text>
          {this.renderActiveGroups()}
        </View>
      </Wrapper>
    );
  }
}

ActiveGroupList.propTypes = {
  groups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default compose(withMyGroups, withNavigation)(ActiveGroupList);
