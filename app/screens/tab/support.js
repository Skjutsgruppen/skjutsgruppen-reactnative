import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Wrapper, FloatingNavbar } from '@components/common';
import Colors from '@theme/colors';
import ProfileDetail from '@components/profile/profile';
import { withProfile } from '@services/apollo/profile';

const Profile = withProfile(ProfileDetail);

class Support extends PureComponent {
  static navigationOptions = {
    header: null,
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
        <FloatingNavbar
          handleBack={this.goBack}
          showChange
          handleChangePress={() => navigation.navigate('EditProfile')}
        />
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
