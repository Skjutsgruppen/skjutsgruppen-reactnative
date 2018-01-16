import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { withMyExperiences } from '@services/apollo/auth';
import ExperienceList from '@components/profile/experienceList';
import PropTypes from 'prop-types';
import { Wrapper, NavBar } from '@components/common';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingBottom: 12,
  },
});

const Experiences = withMyExperiences(ExperienceList);

class UserExperience extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  onPress = (type, experience) => {
    const { navigation } = this.props;
    navigation.navigate('ExperienceDetail', { experience });
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { userId } = this.props.navigation.state.params;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <Experiences
            userId={userId}
            onPress={this.onPress}
          />
        </View>
      </Wrapper>
    );
  }
}

UserExperience.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.object,
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default UserExperience;
