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
    height: 100,
  },
  loadingWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
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
      totalCount: 0,
    };
  }

  componentWillReceiveProps({ alphabetisedGroups, loading, navigation }) {
    let alphabeticalGroups = [];
    if (!loading) {
      this.setState({ loadingState: true });
      let totalCount = 0;
      alphabeticalGroups = alphabetisedGroups.map((row) => {
        totalCount += row.Groups.rows.length + 2;
        return ({
          count: row.Groups.count,
          data: row.Groups.rows,
          title: row.alphabet,
        });
      });
      this.setState({ alphabeticalGroups, loadingState: true, totalCount });
      setTimeout(() => {
        this.sectionList.scrollToLocation({
          sectionIndex: navigation.state.params.sectionIndex,
          itemIndex: -1,
        });
        this.setState({ loadingState: false });
      }, 500);
    }
  }

  getItemLayout = (data, index) => {
    const height = 100;
    // console.log(index);
    return {
      length: height,
      offset: height * index,
      index,
    };
  }

  sectionFooter = ({ section }) => (<AlphabeticalGroupsLoadMore section={section} />);

  redirect = (type, { id }) => {
    const { navigation } = this.props;

    if (type === 'group') {
      navigation.navigate('GroupDetail', { id });
    }
  }

  renderAlphabetisedGroupsList = () => {
    const { alphabeticalGroups, totalCount } = this.state;
    return (
      <SectionList
        ref={(ref) => { this.sectionList = ref; }}
        renderItem={data => (
          data.item.isBlocked ?
            null :
            <GroupsItem
              key={data.item.id}
              group={data.item}
              onPress={this.redirect}
            />
        )}
        keyExtractor={(item, index) => index}
        sections={alphabeticalGroups}
        renderSectionHeader={item => <Heading fontVariation="bold" style={styles.listHeader}>{item.section.title}</Heading>}
        renderSectionFooter={item => this.sectionFooter(item)}
        initialNumToRender={totalCount}
        getItemLayout={this.getItemLayout}
        stickySectionHeadersEnabled
        onEndReachedThreshold={300}
        legacyImplementation
      />
    );
  }

  render() {
    const { loading } = this.props;
    const { loadingState } = this.state;
    return (
      <Wrapper>
        <ToolBar title={trans('group.alphabetical_order')} />
        {this.renderAlphabetisedGroupsList()}
        { (loading || loadingState) && <View style={styles.loadingWrapper}><Loading /></View>}
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
  sectionIndex: PropTypes.number,
};

AlphabeticalGroupsList.defaultProps = {
  alphabetisedGroups: [],
  sectionIndex: 0,
};

export default compose(
  withNavigation,
  withAlphabetisedGroups,
)(AlphabeticalGroupsList);
