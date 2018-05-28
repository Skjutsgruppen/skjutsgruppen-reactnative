import React, { Component } from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import ToolBar from '@components/utils/toolbar';
import { Wrapper, Loading } from '@components/common';
import { Colors } from '@theme';
import { withAlphabetisedGroups } from '@services/apollo/group';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import GroupsItem from '@components/profile/groupsItem';
import AlphabeticalGroupsLoadMore from '@components/group/AlphabeticalGroupsLoadMore';
import PropTypes from 'prop-types';
import { Heading } from '@components/utils/texts';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  listHeader: {
    backgroundColor: Colors.background.mutedBlue,
    paddingTop: 24,
    paddingBottom: 10,
    marginBottom: 4,
    paddingHorizontal: 24,
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

  redirect = (type, { id }) => {
    const { navigation } = this.props;

    if (type === 'group') {
      navigation.navigate('GroupDetail', { id });
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
        renderSectionHeader={item => <Heading fontVariation="bold" style={styles.listHeader}>{item.section.title}</Heading>}
        renderSectionFooter={item => this.sectionFooter(item)}
        stickySectionHeadersEnabled
      />
    );
  }

  render() {
    return (
      <Wrapper>
        <ToolBar title={trans('group.alphabetical_order')} />
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
  alphabetisedGroups: PropTypes.arrayOf(PropTypes.shape()),
};

AlphabeticalGroupsList.defaultProps = {
  alphabetisedGroups: [],
};

export default compose(
  withNavigation,
  withAlphabetisedGroups,
)(AlphabeticalGroupsList);
