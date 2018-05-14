import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Loading } from '@components/common';
import LoadMore from '@components/message/loadMore';
import { withGroupsInMunicipality } from '@services/apollo/group';
import GroupsItem from '@components/profile/groupsItem';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';

class GroupsInMunicipality extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      remaining: 0,
      section: {},
      fetchedData: [],
      offset: 10,
      loading: false,
    };
  }

  componentWillMount() {
    const { section } = this.props;
    const remaining = section.count - section.data.length;

    this.setState({ section, remaining });
  }

  redirect = (type, { id }) => {
    const { navigation } = this.props;

    if (type === 'group') {
      navigation.navigate('GroupDetail', { id });
    }
  }

  async fetchMore() {
    this.setState({ loading: true });
    const { groupsInMunicipality } = this.props;
    const { section, offset, remaining, fetchedData } = this.state;

    await groupsInMunicipality({ municipalityId: section.municipalityId, offset })
      .then(({ data }) => {
        const updatedData = fetchedData.concat(data.groupsInMunicipality.rows);
        this.setState({
          fetchedData: updatedData,
          remaining: remaining - data.groupsInMunicipality.rows.length,
          offset: updatedData.length + 5,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  renderLoadMore = () => {
    const { remaining, loading } = this.state;

    if (remaining < 1) {
      return null;
    }

    if (loading) {
      return (<Loading />);
    }

    return (<LoadMore onPress={() => this.fetchMore()} remainingCount={remaining} />);
  }

  renderFooter = () => {
    const { section, fetchedData } = this.state;

    if (section.count > 10) {
      return (
        <View>
          <FlatList
            data={fetchedData}
            renderItem={({ item }) => (
              <GroupsItem
                key={item.id}
                group={item}
                onPress={this.redirect}
              />
            )}
            keyExtractor={item => item.id}
          />
          {this.renderLoadMore()}
        </View>
      );
    }

    return null;
  }

  render() {
    return (
      <View>
        {this.renderFooter()}
      </View>
    );
  }
}

GroupsInMunicipality.propTypes = {
  groupsInMunicipality: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  section: PropTypes.shape().isRequired,
};

export default compose(withNavigation, withGroupsInMunicipality)(GroupsInMunicipality);

