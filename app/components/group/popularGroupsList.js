import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import { FEEDABLE_GROUP } from '@config/constant';
import { withNavigation } from 'react-navigation';
import Card from '@components/group/discover/card';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    borderColor: '#dddee3',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  filterLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 8,
  },
  activeFilterLabelWrapper: {
    backgroundColor: Colors.background.lightGray,
    borderRadius: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1db0ed',
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    marginRight: 6,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
  },
  listLabel: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginHorizontal: 20,
    marginVertical: 16,
  },
  messageWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
    opacity: 0.5,
  },
  errorWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    opacity: 0.5,
  },
  loadingWrapper: {
    flex: 1,
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});

class PopularGroupsCard extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
    });
  }

  componentWillReceiveProps({ exploreGroups, setGroupsCount }) {
    setGroupsCount(exploreGroups.count);
  }

  redirect = (type, { id }) => {
    const { navigation } = this.props;

    navigation.navigate('GroupDetail', { id });
  }

  renderAllGroups() {
    const { exploreGroups } = this.props;

    return (
      <DataList
        data={exploreGroups}
        renderItem={({ item }) => {
          let image = null;
          if (item.photo) {
            image = { uri: item.photo };
          } else if (item.mapPhoto) {
            image = { uri: item.mapPhoto };
          } else {
            image = require('@assets/feed-img.jpg');
          }

          return (
            <Card
              title={item.name}
              group={item}
              onPress={() => this.redirect(FEEDABLE_GROUP, item)}
              imageURI={image}
            />
          );
        }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        horizontal
        fetchMoreOptions={{
          variables: { offset: exploreGroups.rows.length },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.exploreGroups.rows.length === 0) {
              return previousResult;
            }

            const rows = previousResult.exploreGroups.rows.concat(
              fetchMoreResult.exploreGroups.rows,
            );

            return { exploreGroups: { ...previousResult.exploreGroups, ...{ rows } } };
          },
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.wrapper} >
        {this.renderAllGroups()}
      </View>
    );
  }
}

PopularGroupsCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  exploreGroups: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
    error: PropTypes.object,
    refetch: PropTypes.func,
    fetchMore: PropTypes.func,
  }).isRequired,
  setGroupsCount: PropTypes.func.isRequired,
};

export default withNavigation(PopularGroupsCard);
