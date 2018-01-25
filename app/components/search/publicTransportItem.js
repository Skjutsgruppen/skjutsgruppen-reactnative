import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableHighlight, TouchableOpacity, Linking, Platform, UIManager, LayoutAnimation } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import PropTypes from 'prop-types';
import ExpandIcon from '@assets/icons/ic_chevron_down.png';
import { PUBLIC_TRANSPORT_JOURNEY } from '@config/constant';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  lightText: {
    color: Colors.text.gray,
  },
  wrapper: {
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  single: {
    flex: 1,
    paddingVertical: 12,
  },
  touchable: {
    paddingVertical: 12,
  },
  transportIconWrapper: {
    paddingVertical: 4,
    backgroundColor: '#fff',
    zIndex: 10,
    marginRight: 16,
  },
  expandedTransportIconWrapper: {
    paddingVertical: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    width: 45,
  },
  transportIcon: {
    zIndex: 100,
  },
  title: {
    fontWeight: 'bold',
  },
  pink: {
    backgroundColor: Colors.background.pink,
  },
  blue: {
    backgroundColor: Colors.background.blue,
  },
  expandButton: {
    position: 'absolute',
    top: 10,
    right: 2,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  expandIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
  flipped: {
    transform: [
      { rotate: '180deg' },
    ],
  },
  connectorLine: {
    height: '80%',
    width: 1,
    backgroundColor: Colors.background.gray,
    position: 'absolute',
    top: '10%',
    left: 34,
    zIndex: -1,
  },
  lastTransport: {
    height: 10,
    width: 10,
    backgroundColor: Colors.background.gray,
    borderRadius: 5,
    zIndex: 100,
  },
});

class PublicTransportItem extends Component {
  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    this.state = {
      expanded: false,
    };
  }

  componentWillUpdate() {
    const config = {
      duration: 250,
      update: {
        type: 'easeInEaseOut',
      },
    };
    LayoutAnimation.configureNext(config);
  }

  handleToggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  renderImage = data => (
    <Image source={this.renderIconByCatCode(data)} style={styles.transportIcon} />
  )

  renderIconByCatCode = (product) => {
    const icon = {
      1: require('@assets/icons/ic_train.png'),
      2: require('@assets/icons/ic_regional_intercity_train.png'),
      3: require('@assets/icons/ic_express_bus.png'),
      4: require('@assets/icons/ic_train.png'),
      5: require('@assets/icons/ic_metro.png'),
      6: require('@assets/icons/ic_tram.png'),
      7: require('@assets/icons/ic_bus.png'),
      8: require('@assets/icons/ic_ferry.png'),
      walk: require('@assets/icons/ic_walk.png'),
    };

    if (product) {
      if (icon[product.catCode]) {
        return icon[product.catCode];
      }
    }

    return icon.walk;
  }

  renderTransportIcon = (totalTransports, iconData, index) => {
    if (!this.state.expanded) {
      if (index < 3) {
        return (
          <View style={styles.transportIconWrapper}>
            {this.renderImage(iconData)}
          </View>
        );
      }
      return null;
    }

    return (
      <View style={[styles.transportIconWrapper, styles.expandedTransportIconWrapper]}>
        {
          (index === (totalTransports - 1))
            ? (<View style={styles.lastTransport} />)
            : this.renderImage(iconData)
        }
      </View>
    );
  }

  renderPublicTransports = () => {
    const { publicTransport } = this.props;
    const { Routes } = publicTransport;

    if (Routes.length <= 1) {
      return null;
    }

    if (Routes.length === 2) {
      return (
        <TouchableHighlight
          onPress={() => Linking.openURL(publicTransport.url)}
          underlayColor="#f0f0f0"
        >
          <View style={[styles.flexRow, styles.single]}>
            <View style={styles.transportIconWrapper}>
              {this.renderImage(Routes[0].Product)}
            </View>
            <View>
              {
                (Routes[0].type === PUBLIC_TRANSPORT_JOURNEY) &&
                (<Text style={styles.title}>{Routes[0].Product.name}</Text>)
              }
              <Text style={styles.lightText}>
                <Date format="MMM DD">{Routes[0].Point.date}</Date>, {Routes[0].Point.time}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    }

    let i = 0;
    return publicTransport.Routes.map((route, index) => {
      i += 1;
      return (
        <TouchableHighlight
          key={i}
          onPress={() => Linking.openURL(publicTransport.url)}
          underlayColor="#f0f0f0"
        >
          <View style={[styles.flexRow, styles.touchable]}>
            {this.renderTransportIcon(Routes.length, route.Product, index)}
            {
              this.state.expanded && (
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{route.Point.name}</Text>
                  <Text style={styles.lightText}><Date format="MMM DD">{route.Point.date}</Date>, {route.Point.time}</Text>
                  {
                    (route.type === PUBLIC_TRANSPORT_JOURNEY) &&
                    (<Text>{route.Product.name}</Text>)
                  }
                </View>
              )
            }
          </View>
        </TouchableHighlight>
      );
    });
  }

  render() {
    const { Routes } = this.props.publicTransport;

    return (
      <View style={[styles.wrapper, this.state.expanded ? {} : styles.flexRow]}>
        {this.renderPublicTransports()}
        {
          (!this.state.expanded && Routes.length > 2) && (
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.title}>Combination</Text>
              <Text style={styles.lightText}>
                <Date format="MMM DD">{Routes[0].Point.date}</Date>, {Routes[0].Point.time}
              </Text>
            </View>
          )
        }
        {
          (Routes.length > 2) && (
            <TouchableOpacity
              onPress={this.handleToggle}
              style={styles.expandButton}
            >
              <Image
                source={ExpandIcon}
                style={[styles.expandIcon]}
              />
            </TouchableOpacity>
          )
        }
        {
          this.state.expanded && (
            <View style={styles.connectorLine} />
          )
        }
      </View>
    );
  }
}

PublicTransportItem.propTypes = {
  publicTransport: PropTypes.shape({
    Routes: PropTypes.array,
    url: PropTypes.string,
  }).isRequired,
};

export default PublicTransportItem;
