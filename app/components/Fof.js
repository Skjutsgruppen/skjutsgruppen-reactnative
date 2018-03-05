import React, { PureComponent } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableHighlight, Platform, UIManager, LayoutAnimation, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Colors from '@theme/colors';
import FatArrow from '@assets/icons/icon_arrow_fat.png';
import ThinArrow from '@assets/icons/ic_arrow_gray.png';

const styles = StyleSheet.create({
  labelWrapper: {
    height: 48,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 8,
    justifyContent: 'center',
  },
  expander: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  flipped: {
    transform: [
      { rotate: '180deg' },
    ],
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: Dimensions.get('window').width,
    marginBottom: 12,
  },
  spacer: {
    width: 20,
    height: '100%',
  },
  avatar: {
    height: 48,
    width: 48,
    resizeMode: 'cover',
    borderRadius: 24,
  },
  fatArrow: {
    width: 12,
    resizeMode: 'contain',
    marginHorizontal: 4,
  },
  thinArrow: {
    marginHorizontal: 16,
  },
  bunddledAvatar: {
    height: 56,
    width: 56,
    position: 'relative',
    resizeMode: 'cover',
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#fff',
    zIndex: 5,
  },
  shifted: {
    marginLeft: -10,
    zIndex: 1,
    position: 'relative',
  },
  remainingCount: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.blue,
  },
  countText: {
    color: Colors.text.white,
  },
  names: {
    paddingVertical: 16,
    paddingHorizontal: 42,
  },
  username: {
    fontWeight: '600',
    color: Colors.text.blue,
  },
  chevronDown: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
    marginLeft: 6,
    marginTop: 2,
  },
});

class FOF extends PureComponent {
  static navigationOptions = {
    header: null,
  }
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

  handleExpand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  howYouKnow = () => {
    const { viewee, relation } = this.props;
    const { expanded } = this.state;

    if (relation.path.length === 0 && !relation.areFriends) {
      return (
        <View style={styles.labelWrapper}>
          <Text style={{ fontSize: 13, textAlign: 'center' }}>You have no friend connections</Text>
        </View>
      );
    }

    return (
      <View style={styles.labelWrapper}>
        <Text style={{ fontSize: 13, textAlign: 'center' }}>This is how you know {viewee.firstName}</Text>
        <TouchableHighlight
          onPress={this.handleExpand}
          underlayColor={Colors.background.mutedBlue}
          style={styles.expander}
        >
          <Image
            source={require('@assets/icons/icon_chevron_down.png')}
            style={[styles.chevronDown, expanded ? styles.flipped : {}]}
          />
        </TouchableHighlight>
      </View>
    );
  }

  bundledName = row => row.map(user => ([
    <Text key={user.id} style={styles.username}>{user.firstName}</Text>,
    ' who knows ',
  ]));

  detail = () => {
    const { relation, viewee } = this.props;
    const { expanded } = this.state;

    if (relation.areFriends) {
      return (
        <Text style={[styles.names, { textAlign: 'center' }, expanded ? { height: 100 } : { height: 0 }]}>
          You are friends
        </Text>
      );
    }

    if (relation.path.length === 0) {
      return null;
    }

    return (
      <View>
        <Text style={[styles.names, expanded ? { height: 100 } : { height: 0 }]}>
          You know {relation.path.map(this.bundledName)}
          <Text style={styles.username}>{viewee.firstName}</Text>
        </Text>
      </View>
    );
  }

  renderBunddled = (item, arrow) => {
    if (item.length === 1) {
      return ([
        <Image key={item[0].id} source={{ uri: item[0].avatar }} style={styles.avatar} />,
        arrow,
      ]);
    }

    if (item.length === 2) {
      return ([
        <Image key={item[0].id} source={{ uri: item[0].avatar }} style={styles.bunddledAvatar} />,
        <Image key={item[1].id} source={{ uri: item[1].avatar }} style={styles.bunddledAvatar} />,
        arrow,
      ]);
    }

    return [
      <Image key={item[0].id} source={{ uri: item[0].avatar }} style={styles.bunddledAvatar} />,
      <View style={[styles.remainingCount, styles.shifted]}>
        <Text style={styles.countText}>{item.length - 1}</Text>
      </View>,
      arrow,
    ];
  }

  renderPath = () => {
    const { relation, viewee, user } = this.props;
    if (relation.path.length === 0 && !relation.areFriends) {
      return null;
    }

    const arrow = relation.path.length > 1 ?
      <Image source={FatArrow} style={styles.fatArrow} />
      : <Image source={ThinArrow} style={styles.thinArrow} />;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.list}>
          <View style={styles.spacer} />
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          {arrow}
          {relation.path.map(row => this.renderBunddled(row, arrow))}
          <Image source={{ uri: viewee.avatar }} style={styles.avatar} />
          <View style={styles.spacer} />
        </View>
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={[styles.wrapper]}>
        {this.howYouKnow()}
        {this.renderPath()}
        {this.detail()}
      </View>
    );
  }
}

FOF.propTypes = {
  relation: PropTypes.shape({
    path: PropTypes.arrayOf(PropTypes.array),
    areFriends: PropTypes.bool,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
  }).isRequired,
  viewee: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(FOF);

