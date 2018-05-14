import React, { PureComponent } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableHighlight, Platform, UIManager, LayoutAnimation, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import Colors from '@theme/colors';
import FatArrow from '@assets/icons/icon_arrow_fat.png';
import ThinArrow from '@assets/icons/ic_arrow_gray.png';
import { AppText } from '@components/utils/texts';
import Avatar from '@components/common/avatar';
import { trans } from '@lang/i18n';

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

    if (relation.path && relation.path.length === 0 && !relation.areFriends) {
      return (
        <View style={styles.labelWrapper}>
          <AppText size={13} style={{ textAlign: 'center' }}>{trans('global.you_have_no_friend_connections')}</AppText>
        </View>
      );
    }

    return (
      <View style={styles.labelWrapper}>
        <AppText size={13} style={{ textAlign: 'center' }}>{trans('global.this_is_how_you_know_user', { user: viewee.firstName })}</AppText>
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
        <AppText
          key={user.id}
          onPress={() => navigation.navigate('Profile', { profileId: user.id })}
          color={Colors.text.blue}
        >
          {user.firstName}
        </AppText>,
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
        <AppText style={[{ textAlign: 'center', marginTop: 12 }, expanded ? { minHeight: 32 } : { height: 0 }]}>
          You are friends
        </AppText>
      );
    }

    if (relation.path && relation.path.length === 0) {
      return null;
    }

    return (
      <View style={{ paddingHorizontal: 24 }}>
        <AppText style={[{ marginTop: 12 }, expanded ? { minHeight: 32 } : { height: 0 }]}>
          You know {relation.path.map(this.bundledName)}
          <AppText
            fontVariation="semibold"
            color={Colors.text.blue}
            onPress={() => navigation.navigate('Profile', { profileId: viewee.id })}
          >
            {viewee.firstName}
          </AppText>
        </AppText>
      </View>
    );
  }

  renderBunddled = (item, arrow) => {
    const { navigation } = this.props;
    if (item && item.length === 1) {
      return ([
        <Avatar
          imageURI={item[0].avatar}
          size={48}
          key={item[0].id}
          onPress={() => navigation.navigate('Profile', { profileId: item[0].id })}
          style={styles.avatar}
          isSupporter={item[0].isSupporter}
        />,
        arrow,
      ]);
    }

    if (item && item.length === 2) {
      return ([
        <Avatar
          imageURI={item[0].avatar}
          size={48}
          key={item[0].id}
          onPress={() => navigation.navigate('Profile', { profileId: item[0].id })}
          style={styles.bunddledAvatar}
          isSupporter={item[0].isSupporter}
        />,
        <Avatar
          imageURI={item[1].avatar}
          size={48}
          key={item[1].id}
          onPress={() => navigation.navigate('Profile', { profileId: item[1].id })}
          style={[styles.bunddledAvatar, styles.shifted]}
          isSupporter={item[1].isSupporter}
        />,
        arrow,
      ]);
    }

    return [
      <Avatar
        key={item[0].id}
        imageURI={item[0].avatar}
        size={48}
        onPress={() => navigation.navigate('Profile', { profileId: item[0].id })}
        style={styles.bunddledAvatar}
        isSupporter={item[0].isSupporter}
      />,
      <View key={item[1].id} style={[styles.remainingCount, styles.shifted]}>
        <AppText size={14} color={Colors.text.white}>{item.length - 1}</AppText>
      </View>,
      arrow,
    ];
  }

  renderPath = () => {
    const { relation, viewee, user, navigation } = this.props;

    if (relation.path && relation.path.length === 0 && !relation.areFriends) {
      return null;
    }

    const arrow = relation.path.length > 1 ?
      <Image source={FatArrow} style={styles.fatArrow} />
      : <Image source={ThinArrow} style={styles.thinArrow} />;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.list}>
          <View style={styles.spacer} />
          <Avatar
            imageURI={user.avatar}
            size={48}
            onPress={() => navigation.navigate('Profile', { profileId: user.id })}
            isSupporter={user.isSupporter}
          />
          {arrow}
          {relation.path.map(row => this.renderBunddled(row, arrow))}
          <Avatar
            imageURI={viewee.avatar}
            size={48}
            onPress={() => navigation.navigate('Profile', { profileId: viewee.id })}
            isSupporter={viewee.isSupporter}
          />
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
    if (item && item.length === 1) {
      return ([
        <Avatar
          key={item[0].id}
          imageURI={item[0].avatar}
          size={24}
          isSupporter={item[0].isSupporter}
        />,
        arrow,
      ]);
    }

    if (item && item.length === 2) {
      return ([
        <Avatar
          key={item[0].id}
          imageURI={item[0].avatar}
          size={24}
          style={styles.bunddledAvatarMini}
          isSupporter={item[0].isSupporter}
        />,
        <Avatar
          key={item[1].id}
          imageURI={item[1].avatar}
          size={24}
          style={[styles.bunddledAvatarMini, styles.shiftedMini]}
          isSupporter={item[1].isSupporter}
        />,
        arrow,
      ]);
    }

    return [
      <Avatar
        key={item[0].id}
        imageURI={item[0].avatar}
        size={24}
        style={styles.bunddledAvatarMini}
        isSupporter={item[0].isSupporter}
      />,
      <View key={item[1].id} style={[styles.remainingCountMini, styles.shiftedMini]}>
        <AppText size={10} color={Colors.text.white}>{item.length - 1}</AppText>
      </View>,
      arrow,
    ];
  }

  renderMini = () => {
    const { relation, viewee, user, navigation, displayNoConnection } = this.props;

    if (relation.path && relation.path.length === 0 && !relation.areFriends) {
      if (displayNoConnection) {
        return null;
      }

      return (
        <View style={[styles.labelWrapper, { marginTop: 0, marginBottom: 0, height: 24 }]}>
          <AppText size={11} color={Colors.text.gray}>
            {trans('global.you_have_no_friend_connections')}
          </AppText>
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
            <AppText size={11} color={Colors.text.gray}>
              {relation.areFriends ? trans('detail.you_are_friends') : trans('detail.you_are_friends_of_friends')}
            </AppText>
          </View>
          <View style={[styles.list, styles.listLeft]}>
            <View style={styles.spacer} />
            <Avatar imageURI={user.avatar} size={24} isSupporter={user.isSupporter} />
            {arrow}
            {relation.path.map(row => this.renderBunddledMini(row, arrow))}
            <Avatar imageURI={viewee.avatar} size={24} isSupporter={viewee.isSupporter} />
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
  displayNoConnection: PropTypes.bool,
};

FOF.defaultProps = {
  mini: false,
  displayNoConnection: false,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNavigation, connect(mapStateToProps))(FOF);
