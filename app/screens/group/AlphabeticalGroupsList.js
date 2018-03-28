import React, { Component } from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import ToolBar from '@components/utils/toolbar';
import { Wrapper, Loading } from '@components/common';
import { Colors } from '@theme';
import { withAlphabetisedGroups } from '@services/apollo/group';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import GroupsItem from '@components/profile/groupsItem';
import AlphabeticalGroupsLoadMore from '@components/group/AlphabeticalGroupsLoadMore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  listHeader: {
    backgroundColor: Colors.background.cream,
    paddingTop: 24,
    paddingBottom: 5,
    marginBottom: 19,
    paddingHorizontal: 24,
    color: Colors.text.darkGray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});

class AlphabeticalGroupsList extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      alphabeticalGroups: [],
      loadingState: false,
      sectionLoadMoreArray: [],
    };
  }

  componentWillReceiveProps({ alphabetisedGroups, loading }) {
    let alphabeticalGroups = [];

    if (!loading) {
      this.setState({ loadingState: true });

      alphabeticalGroups = alphabetisedGroups.map(row => ({
        count: row.Groups.count,
        data: row.Groups.rows,
        title: row.alphabet,
      }));

      this.setState({ alphabeticalGroups, loadingState: false });
    }
  }

  sectionFooter = ({ section }) => {
    const { loadingState } = this.state;

    if (loadingState) return null;

    return (<AlphabeticalGroupsLoadMore section={section} />);
  }

  redirect = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
    }
  }

  renderAlphabetisedGroupsList = () => {
    const { loading } = this.props;
    const { alphabeticalGroups, loadingState } = this.state;

    if (loading) {
      return (<View style={styles.loadingWrapper}><Loading /></View>);
    }

    if (loadingState) {
      return null;
    }

    return (
      <SectionList
        renderItem={({ item }) => (
          <GroupsItem
            key={item.id}
            group={item}
            onPress={this.redirect}
          />)
        }
        keyExtractor={(item, index) => index}
        sections={alphabeticalGroups}
        renderSectionHeader={item => <Text style={styles.listHeader}>{item.section.title}</Text>}
        renderSectionFooter={item => this.sectionFooter(item)}
        stickySectionHeadersEnabled
      />
    );
  }

  render() {
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <ToolBar title="Alphabetical order" />
        {this.renderAlphabetisedGroupsList()}
      </Wrapper>
    );
  }
}

AlphabeticalGroupsList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  alphabetisedGroups: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default compose(
  withNavigation,
  withAlphabetisedGroups,
)(AlphabeticalGroupsList);
