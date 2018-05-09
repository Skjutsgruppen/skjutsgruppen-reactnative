import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Linking, Platform, UIManager, LayoutAnimation } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import PropTypes from 'prop-types';
import ExpandIcon from '@assets/icons/ic_chevron_down.png';
import { PUBLIC_TRANSPORT_JOURNEY } from '@config/constant';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';
import TouchableHighlight from '@components/touchableHighlight';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  wrapper: {
    borderRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 16,
    marginBottom: 24,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  list: {
    backgroundColor: Colors.background.fullWhite,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
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
  footerWrapper: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.pink,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  chevron: {
    marginLeft: 16,
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
                (<AppText fontVariation="bold">{Routes[0].Product.name}</AppText>)
              }
              <AppText color={Colors.text.gray}>
                <Date format="MMM DD">{Routes[0].Point.date}</Date>, {Routes[0].Point.time}
              </AppText>
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
                  <AppText fontVariation="bold">{route.Point.name}</AppText>
                  <AppText color={Colors.text.gray}><Date format="MMM DD">{route.Point.date}</Date>, {route.Point.time}</AppText>
                  {
                    (route.type === PUBLIC_TRANSPORT_JOURNEY) &&
                    (<AppText>{route.Product.name}</AppText>)
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
      <View style={styles.wrapper}>
        <View style={[styles.list, this.state.expanded ? {} : styles.flexRow]}>
          {this.renderPublicTransports()}
          {
            (!this.state.expanded && Routes.length > 2) && (
              <View style={{ alignSelf: 'center' }}>
                <AppText fontVariation="bold">Combination</AppText>
                <AppText color={Colors.text.gray}>
                  <Date format="MMM DD">{Routes[0].Point.date}</Date>, {Routes[0].Point.time}
                </AppText>
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
        {this.state.expanded &&
          <View style={styles.footerWrapper}>
            <TouchableHighlight onPress={() => Linking.openURL('https://resrobot.se/')}>
              <View style={styles.footer}>
                <AppText color={Colors.text.white} style={{ flex: 1 }}>
                  {trans('search.public_transport_message')}
                </AppText>
                <Image source={require('@assets/icons/ic_chevron_right.png')} style={styles.chevron} />
              </View>
            </TouchableHighlight>
          </View>
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
