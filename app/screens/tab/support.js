import React, { PureComponent } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Wrapper } from '@components/common';
import Colors from '@theme/colors';
import BackButton from '@components/common/backButton';
import ProfileDetail from '@components/profile/profile';
import { withProfile } from '@services/apollo/profile';

import SupportIcon from '@assets/icons/ic_support.png';
import SupportIconActive from '@assets/icons/ic_support_active.png';

const Profile = withProfile(ProfileDetail);

const styles = StyleSheet.create({
  navbar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  section: {
    paddingVertical: 32,
  },
  button: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  menuItem: {
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: 160,
  },
  menuText: {
    width: 160,
    color: Colors.text.darkGray,
    backgroundColor: 'transparent',
  },
});

class Support extends PureComponent {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Support',
    tabBarIcon: ({ focused }) => <Image source={focused ? SupportIconActive : SupportIcon} />,
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { navigation, user } = this.props;

    if (!user.id) {
      return null;
    }

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <View style={styles.navbar}>
          <BackButton onPress={this.goBack} >Back</BackButton>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon
              name="ios-options"
              size={18}
              color="#777"
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, backgroundColor: Colors.background.fullWhite }}>
          <ScrollView>
            <Profile
              id={user.id}
            />
          </ScrollView>
        </View>
      </Wrapper>
    );
  }
}

Support.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Support);
