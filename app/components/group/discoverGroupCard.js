import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Loading } from '@components/common';
import { Colors, Gradients } from '@theme';
import { Heading } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';

const cardHeight = 130;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 75,
    height: cardHeight,
    borderRadius: 24,
    backgroundColor: Colors.background.red,
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    height: cardHeight,
    width: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text.white,
    textAlign: 'center',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: cardHeight,
    width: '100%',
    padding: 12,
  },
});

class DiscoverGroupCard extends PureComponent {
  redirectToExploreGroup = () => {
    const { navigation } = this.props;
    navigation.navigate('ExploreGroup');
  }

  render() {
    const { exploreGroups: { rows, loading } } = this.props;

    if (loading) {
      return (<Loading />);
    }

    let image = require('@assets/feed-map.jpg');

    if (rows.length > 0) {
      if (rows[0].mapPhoto) {
        image = { uri: rows[0].mapPhoto };
      } else {
        image = { uri: rows[0].photo };
      }
    }

    return (
      <View style={styles.wrapper}>
        <TouchableHighlight onPress={this.redirectToExploreGroup} activeOpacity={0.8} >
          <View style={styles.content}>
            <Image source={image} style={styles.image} />
            <LinearGradient
              start={{ x: 0.0, y: 0.5 }}
              end={{ x: 1.0, y: 0.5 }}
              colors={Gradients.transparentPink}
              style={styles.overlay}
            >
              <Heading
                size={24}
                color={Colors.text.white}
                fontVariation="bold"
                style={styles.title}
              >
                Discover groups
              </Heading>
            </LinearGradient>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

DiscoverGroupCard.propTypes = {
  exploreGroups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape()),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

DiscoverGroupCard.defaultProps = {
  style: {},
  exploreGroups: {
    rows: [],
    loading: true,
  },
};

export default withNavigation(DiscoverGroupCard);
