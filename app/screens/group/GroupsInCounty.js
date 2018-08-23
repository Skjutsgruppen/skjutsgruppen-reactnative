import React, { Component } from 'react';
import { View, Image, StyleSheet, SectionList, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { withGroupsInCounty } from '@services/apollo/group';
import { Wrapper, Loading } from '@components/common';
import ToolBar from '@components/utils/toolbar';
import { Colors, Gradients } from '@theme';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import GroupsItem from '@components/profile/groupsItem';
import GroupsInMunicipality from '@components/group/groupsInMunicipality';
import { Heading } from '@components/utils/texts';

const cardHeight = 484;

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.75,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: cardHeight / 2,
    overflow: 'hidden',
    backgroundColor: Colors.background.black,
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: cardHeight / 2,
    width: '100%',
    padding: 12,
  },
  listHeader: {
    paddingTop: 24,
    paddingBottom: 5,
    marginBottom: 19,
    paddingHorizontal: 24,
    color: Colors.text.pink,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    marginTop: 24,
    marginBottom: 8,
  },
});

class GroupsListByCounty extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { groupsByCounty: [] };

    this.animatedValue = new Animated.Value(0);
  }

  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ animatedValue: this.animatedValue });
  }

  componentWillReceiveProps({ groupsInCounty }) {
    let groupsByCounty = [];

    if (groupsInCounty && groupsInCounty.length > 0) {
      groupsByCounty = groupsInCounty.map(row => ({
        data: row.Groups.rows,
        count: row.Groups.count,
        title: row.Municipality.name,
        municipalityId: row.Municipality.id,
      }));

      this.setState({ groupsByCounty });
    }
  }

  onPress = (type, { id }) => {
    const { navigation } = this.props;

    if (type === 'group') {
      navigation.navigate('GroupDetail', { id });
    }
  }

  header = () => {
    const { navigation } = this.props;

    return (
      <View style={styles.wrapper}>
        <Image
          source={{ uri: navigation.state.params.county.photoUrl }}
          style={styles.img}
        />
        <LinearGradient
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          colors={Gradients.transparentPink}
          style={styles.overlay}
        >
          <Heading size={18} centered color={Colors.text.white} fontVariation="bold">{navigation.state.params.county.name}</Heading>
        </LinearGradient>
      </View>
    );
  }

  sectionFooter = ({ section }) => {
    const { loading } = this.props;

    if (loading) return null;

    return (
      <View>
        <GroupsInMunicipality section={section} />
        <View style={styles.divider} />
      </View>
    );
  }

  renderGroupsInCountyList = () => {
    const { loading } = this.props;
    const { groupsByCounty } = this.state;

    if (loading) {
      return (<Loading style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />);
    }

    if (groupsByCounty.length < 1) {
      return null;
    }

    return (
      <SectionList
        ListHeaderComponent={this.header}
        ListFooterComponent={() => <View style={{ height: 50 }} />}
        renderItem={({ item }) => (
          item.isBlocked ?
            null :
            <GroupsItem
              key={item.id}
              group={item}
              onPress={this.onPress}
            />)
        }
        keyExtractor={(item, index) => index}
        sections={groupsByCounty}
        renderSectionHeader={item => <Heading fontVariation="bold" style={styles.listHeader}>{item.section.title}</Heading>}
        renderSectionFooter={item => this.sectionFooter(item)}
        stickySectionHeadersEnabled
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.animatedValue } } }])}
      />
    );
  }

  render() {
    return (
      <Wrapper bgColor={Colors.background.fullWhite}>
        <ToolBar transparent />
        {this.renderGroupsInCountyList()}
      </Wrapper>
    );
  }
}

GroupsListByCounty.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  groupsInCounty: PropTypes.arrayOf(PropTypes.shape()),
};

GroupsListByCounty.defaultProps = {
  groupsInCounty: [],
};


const GroupCountiesList = compose(withGroupsInCounty, withNavigation)(GroupsListByCounty);

const GroupsInCounty = ({ navigation }) => (
  <GroupCountiesList countyId={navigation.state.params.id} />
);

GroupsInCounty.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

GroupsInCounty.navigationOptions = {
  header: null,
};

export default GroupsInCounty;
