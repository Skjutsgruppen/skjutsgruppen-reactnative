import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import PropTypes from 'prop-types';
import ExpandIcon from '@icons/ic_chevron_down.png';
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
  transportIcon: {
    marginRight: 18,
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
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.background.gray,
    position: 'absolute',
    top: '10%',
    left: 28,
    zIndex: -1,
  },
  lastTransport: {
    height: 10,
    width: 10,
    backgroundColor: Colors.background.gray,
    borderRadius: 5,
    marginRight: 29,
    marginLeft: 11,
    zIndex: 100,
  },
});

class PublicTransportItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  handleToggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  renderImage = data => (
    <Image source={this.renderIconByCatCode(data)} style={styles.transportIcon} />
  )

  renderIconByCatCode = (product) => {
    const icon = {
      3: require('@icons/ic_train.png'),
      7: require('@icons/ic_bus.png'),
    };

    if (product) {
      if (icon[product.catCode]) {
        return icon[product.catCode];
      }
    }

    return icon[7];
  }

  renderTransportIcon = (totalTransports, iconData, index) => {
    if (!this.state.expanded) {
      if (index < 3) {
        return (
          <View style={{ paddingVertical: 4, backgroundColor: '#fff', zIndex: 10 }}>
            {this.renderImage(iconData)}
          </View>
        );
      }
      return null;
    }

    return (
      <View style={{ paddingVertical: 4, backgroundColor: '#fff', zIndex: 10 }}>
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
        <TouchableOpacity
          onPress={() => Linking.openURL(publicTransport.url)}
          style={[styles.flexRow, styles.single]}
        >
          {this.renderImage(Routes[0].Product)}
          <View>
            {
              (Routes[0].type === PUBLIC_TRANSPORT_JOURNEY) &&
              (<Text style={styles.title}>{Routes[0].Product.name}</Text>)
            }
            <Text style={styles.lightText}>
              <Date format="MMM DD">{Routes[0].Point.date}</Date>, {Routes[0].Point.time}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return publicTransport.Routes.map((route, index) => {
      const i = index;

      return (
        <TouchableOpacity
          key={i}
          onPress={() => Linking.openURL(publicTransport.url)}
          style={[styles.flexRow, styles.touchable]}
        >
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
        </TouchableOpacity>
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
                style={[styles.expandIcon, this.state.expanded ? styles.flipped : {}]}
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
