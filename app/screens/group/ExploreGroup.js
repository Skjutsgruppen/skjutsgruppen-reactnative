/* global navigator */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  FlatList,
  Animated,
  Modal,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import PropTypes from 'prop-types';
import { withExploreGroup, withNearByGroups } from '@services/apollo/group';
import { withCounties } from '@services/apollo/location';
import { Wrapper, Loading } from '@components/common';
import TouchableHighlight from '@components/touchableHighlight';
import Colors from '@theme/colors';
import PopularGroupsCards from '@components/group/popularGroupsList';
import Card from '@components/group/discover/card';
import Alphabet from '@components/group/discover/alphabet';
import ListSearchModal from '@components/profile/ListSearchModal';
import CloseByGroupsMapWindow from '@components/group/closeByGroupsMapWindow';
import TabBar from '@components/common/tabBar';
import { AppText, Heading } from '@components/utils/texts';

import IconSearch from '@assets/icons/ic_search.png';

const NearByGroupsMapWindow = withNearByGroups(CloseByGroupsMapWindow);

const AnimatedFlatlist = Animated.createAnimatedComponent(
  FlatList,
);

const PopularGroupsList = withExploreGroup(PopularGroupsCards);

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  totalGroups: {
    fontSize: 16,
    color: Colors.text.gray,
  },
  countryName: {
    color: Colors.text.gray,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.text.pink,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  searchIconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  searchIcon: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapWrapper: {
    height: 400,
    backgroundColor: '#fff',
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 16,
  },
  innerMapWrapper: {
    height: 400,
    backgroundColor: 'transparent',
  },
  locationTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLocationText: {
    color: 'white',
    paddingHorizontal: 24,
    textAlign: 'center',
  },
  noLocationRetry: {
    color: Colors.text.blue,
  },
});

class ExploreGroup extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = ({
      loading: true,
      isOpen: false,
      totalGroupsCount: 0,
      error: '',
      origin: {
        latitude: '',
        longitude: '',
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    });
  }

  async componentWillMount() {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    } catch (err) {
      console.warn(err);
    }
    this.currentLocation();
  }

  onSearchPress = () => {
    this.setState({ isOpen: true });
  }

  onClose = () => {
    this.setState({ isOpen: false });
  }

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === 'profile') {
      navigation.navigate('Profile', { profileId: detail });
    }

    if (type === 'group') {
      navigation.navigate('GroupDetail', { group: detail });
    }

    if (type === 'GroupsInCounty') {
      navigation.navigate('GroupsInCounty', { county: detail });
    }

    if (type === 'AlphabeticalGroups') {
      navigation.navigate('AlphabeticalGroupsList');
    }
    this.onClose();
  }

  setGroupsCount = (totalGroupsCount) => {
    this.setState({ totalGroupsCount });
  }

  currentLocation = () => {
    this.setState({ loading: true });
    const { origin } = this.state;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        origin.latitude = position.coords.latitude;
        origin.longitude = position.coords.longitude;
        this.setState({ origin, loading: false });
      },
      () => {
        this.setState({ loading: false, error: 'Sorry, could not track your location! Please check if your GPS is turned on.' });
      },
      { timeout: 20000, maximumAge: 1000 },
    );
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  renderSearchModal = () => (
    <Modal
      visible={this.state.isOpen}
      onRequestClose={() => this.setState({ isOpen: false })}
      animationType="slide"
    >
      <ListSearchModal
        onPress={this.onPress}
        onClose={this.onClose}
        searchCategory="exploreGroups"
      />
    </Modal>
  )

  renderMap = () => {
    const { loading, origin, error } = this.state;

    if (loading) {
      return (
        <View style={styles.locationTextWrapper}>
          <Loading />
        </View>
      );
    }

    if (origin.latitude === '' || origin.longitude === '') {
      return (
        <View style={styles.locationTextWrapper}>
          <AppText size={14} centered color={Colors.text.gray} style={{ paddingHorizontal: 24 }}>
            {error}</AppText>
          <AppText
            centered
            color={Colors.text.darkGray}
            fontVariation="bold"
            style={{ paddingHorizontal: 24, marginTop: 16 }}
            onPress={this.currentLocation}
          >Tap to retry!</AppText>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('CloseByGroupsMap', { origin })}
        style={styles.innerMapWrapper}
      >
        <NearByGroupsMapWindow
          from={[origin.longitude, origin.latitude]}
          distFrom={0}
          distTo={100000000}
          origin={origin}
          outreach={null}
          type={null}
        />
      </TouchableOpacity>
    );
  }

  renderCountiesList = () => {
    const { counties } = this.props;

    return (
      <AnimatedFlatlist
        data={counties}
        renderItem={({ item }) => (<Card
          title={item.name}
          onPress={() => this.onPress('GroupsInCounty', item)}
          imageURI={{ uri: item.photoUrl }}
          colorOverlay
        />)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
      />
    );
  }

  render() {
    const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const { totalGroupsCount } = this.state;
    let index = 0;

    return (
      <Wrapper>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Heading style={{ marginBottom: 16 }}>Discover groups</Heading>
              <AppText color={Colors.text.gray}>Currently {totalGroupsCount} groups</AppText>
            </View>
            <View style={styles.searchIconWrapper}>
              <TouchableHighlight onPress={this.onSearchPress} style={styles.searchIcon}>
                <Image source={IconSearch} />
              </TouchableHighlight>
            </View>
          </View>
          <Heading style={styles.sectionTitle}>Popular</Heading>
          <View style={styles.section}>
            <PopularGroupsList setGroupsCount={this.setGroupsCount} from={null} filter="popular" />
          </View>
          <Heading style={styles.sectionTitle}>Close to you</Heading>
          <View style={styles.section}>
            <View style={styles.mapWrapper}>
              {this.renderMap()}
            </View>
          </View>
          <Heading style={styles.sectionTitle}>County</Heading>
          <AppText style={styles.countryName}>Sweden</AppText>
          <View style={styles.section}>
            {this.renderCountiesList()}
          </View>
          <Heading style={styles.sectionTitle}>Alphabetic order</Heading>
          <View style={styles.section}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {alphabets.map((alphabet) => {
                index += 1;
                return (
                  <Alphabet
                    key={index}
                    onPress={() => this.onPress('AlphabeticalGroups')}
                    letter={alphabet}
                  />
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
        <TabBar />
        {this.renderSearchModal()}
      </Wrapper >
    );
  }
}

ExploreGroup.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  counties: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default withCounties(ExploreGroup);
