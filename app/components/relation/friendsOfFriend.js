import React, { PureComponent } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, TouchableHighlight, Platform, UIManager, LayoutAnimation, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
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
  listLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 0,
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
  avatarMini: {
    height: 24,
    width: 24,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  fatArrow: {
    width: 12,
    resizeMode: 'contain',
    marginTop: 3,
    marginHorizontal: 3,
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
  bunddledAvatarMini: {
    height: 28,
    width: 28,
    position: 'relative',
    resizeMode: 'cover',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 5,
  },
  shifted: {
    marginLeft: -10,
    zIndex: 1,
    position: 'relative',
  },
  shiftedMini: {
    marginLeft: -5,
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
  remainingCountMini: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.blue,
  },
  countText: {
    color: Colors.text.white,
  },
  countTextMini: {
    color: Colors.text.white,
    fontSize: 10,
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

  bundledName = (row) => {
    const name = row.map((user, index) => {
      const { navigation } = this.props;
      let separator = ' and ';
      if (index < (row.length - 2)) {
        separator = ', ';
      }

      if (index === (row.length - 1)) {
        separator = '';
      }


      return ([
        <Text
          key={user.id}
          onPress={() => navigation.navigate('Profile', { profileId: user.id })}
          style={styles.username}
        >
          {user.firstName}
        </Text>,
        separator,
      ]);
    });

    return ([name, ' who knows ']);
  }

  detail = () => {
    const { relation, viewee, navigation } = this.props;
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
      <View style={{ paddingHorizontal: 24 }}>
        <Text style={[expanded ? { height: 100 } : { height: 0 }]}>
          You know {relation.path.map(this.bundledName)}
          <Text
            onPress={() => navigation.navigate('Profile', { profileId: viewee.id })}
            style={styles.username}
          >
            {viewee.firstName}
          </Text>
        </Text>
      </View>
    );
  }

  renderBunddled = (item, arrow) => {
    const { navigation } = this.props;
    if (item.length === 1) {
      return ([
        <TouchableHighlight
          key={item[0].id}
          onPress={() => navigation.navigate('Profile', { profileId: item[0].id })}
          underlayColor={Colors.background.mutedBlue}
        >
          <Image source={{ uri: item[0].avatar }} style={styles.avatar} />
        </TouchableHighlight>,
        arrow,
      ]);
    }

    if (item.length === 2) {
      return ([
        <TouchableHighlight
          key={item[0].id}
          onPress={() => navigation.navigate('Profile', { profileId: item[0].id })}
          underlayColor={Colors.background.mutedBlue}
        >
          <Image source={{ uri: item[0].avatar }} style={styles.bunddledAvatar} />
        </TouchableHighlight>,
        <TouchableHighlight
          key={item[1].id}
          onPress={() => navigation.navigate('Profile', { profileId: item[1].id })}
          underlayColor={Colors.background.mutedBlue}
          style={styles.shifted}
        >
          <Image source={{ uri: item[1].avatar }} style={styles.bunddledAvatar} />
        </TouchableHighlight>,
        arrow,
      ]);
    }

    return [
      <TouchableHighlight
        key={item[0].id}
        onPress={() => navigation.navigate('Profile', { profileId: item[0].id })}
        underlayColor={Colors.background.mutedBlue}
      >
        <Image source={{ uri: item[0].avatar }} style={styles.bunddledAvatar} />
      </TouchableHighlight>,
      <View key={item[1].id} style={[styles.remainingCount, styles.shifted]}>
        <Text style={styles.countText}>{item.length - 1}</Text>
      </View>,
      arrow,
    ];
  }

  renderPath = () => {
    const { relation, viewee, user, navigation } = this.props;
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
          <TouchableHighlight
            onPress={() => navigation.navigate('Profile', { profileId: user.id })}
            underlayColor={Colors.background.mutedBlue}
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </TouchableHighlight>
          {arrow}
          {relation.path.map(row => this.renderBunddled(row, arrow))}
          <TouchableHighlight
            onPress={() => navigation.navigate('Profile', { profileId: viewee.id })}
            underlayColor={Colors.background.mutedBlue}
          >
            <Image source={{ uri: viewee.avatar }} style={styles.avatar} />
          </TouchableHighlight>
          <View style={styles.spacer} />
        </View>
      </ScrollView>
    );
  }

  renderFull = () => (
    <View>
      {this.howYouKnow()}
      {this.renderPath()}
      {this.detail()}
    </View>
  );

  renderBunddledMini = (item, arrow) => {
    if (item.length === 1) {
      return ([
        <Image key={item[0].id} source={{ uri: item[0].avatar }} style={styles.avatarMini} />,
        arrow,
      ]);
    }

    if (item.length === 2) {
      return ([
        <Image
          key={item[0].id}
          source={{ uri: item[0].avatar }}
          style={styles.bunddledAvatarMini}
        />,
        <Image
          key={item[1].id}
          source={{ uri: item[1].avatar }}
          style={[styles.bunddledAvatarMini, styles.shiftedMini]}
        />,
        arrow,
      ]);
    }

    return [
      <Image key={item[0].id} source={{ uri: item[0].avatar }} style={styles.bunddledAvatarMini} />,
      <View key={item[1].id} style={[styles.remainingCountMini, styles.shiftedMini]}>
        <Text style={styles.countTextMini}>{item.length - 1}</Text>
      </View>,
      arrow,
    ];
  }

  renderMini = () => {
    const { relation, viewee, user, navigation } = this.props;
    if (relation.path.length === 0 && !relation.areFriends) {
      return (
        <View style={[styles.labelWrapper, { marginTop: 0, marginBottom: 0, height: 24 }]}>
          <Text style={{ fontSize: 11, color: Colors.text.gray }}>
            You have no friend connections
          </Text>
        </View>
      );
    }

    const arrow = <Image source={FatArrow} style={styles.fatArrow} />;

    return (
      <TouchableHighlight
        onPress={() => navigation.navigate('Profile', { profileId: viewee.id })}
        underlayColor={Colors.background.mutedBlue}
      >
        <View>
          <View style={[styles.labelWrapper, { marginTop: 0, marginBottom: 0, height: 24 }]}>
            <Text style={{ fontSize: 11, color: Colors.text.gray }}>
              {relation.areFriends ? 'You are friends' : 'You are Friends of Friend!'}
            </Text>
          </View>
          <View style={[styles.list, styles.listLeft]}>
            <View style={styles.spacer} />
            <Image source={{ uri: user.avatar }} style={styles.avatarMini} />
            {arrow}
            {relation.path.map(row => this.renderBunddledMini(row, arrow))}
            <Image source={{ uri: viewee.avatar }} style={styles.avatarMini} />
            <View style={styles.spacer} />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { mini } = this.props;
    if (mini) {
      return this.renderMini();
    }

    return this.renderFull();
  }
}

FOF.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
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
  mini: PropTypes.bool,
};

FOF.defaultProps = {
  mini: false,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNavigation, connect(mapStateToProps))(FOF);
