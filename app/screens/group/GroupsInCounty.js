import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, SectionList, Animated } from 'react-native';
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
  title: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
    alignSelf: 'center',
    marginHorizontal: 24,
    textAlign: 'center',
  },
  listHeader: {
    backgroundColor: Colors.background.fullWhite,
    paddingTop: 24,
    paddingBottom: 5,
    marginBottom: 19,
    paddingHorizontal: 24,
    color: Colors.text.pink,
    fontSize: 16,
    fontWeight: 'bold',
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

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
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
          <Text style={styles.title}>{navigation.state.params.county.name}</Text>
        </LinearGradient>
      </View>
    );
  }

  sectionFooter = ({ section }) => {
    const { loading } = this.props;

    if (loading) return null;

    return (<GroupsInMunicipality section={section} />);
  }

  renderGroupsInCountyList = () => {
    const { loading } = this.props;
    const { groupsByCounty } = this.state;

    if (loading) {
      return (<Loading style={{ marginTop: 85, marginBottom: 24 }} />);
    }

    return (
      <SectionList
        ListHeaderComponent={this.header}
        ListFooterComponent={() => <View style={{ height: 50 }} />}
        renderItem={({ item, index, section }) => (
          <GroupsItem
            key={item.id}
            index={index}
            section={section}
            group={item}
            onPress={this.onPress}
          />)
        }
        keyExtractor={(item, index) => index}
        sections={groupsByCounty}
        renderSectionHeader={item => <Text style={styles.listHeader}>{item.section.title}</Text>}
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
  groupsInCounty: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};


const GroupCountiesList = compose(withGroupsInCounty, withNavigation)(GroupsListByCounty);

const GroupsInCounty = ({ navigation }) => (
  <GroupCountiesList countyId={navigation.state.params.county.id} />
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
