import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { withMyExperiences } from '@services/apollo/auth';
import ExperienceList from '@components/profile/experienceList';
import PropTypes from 'prop-types';
import { Wrapper, NavBar } from '@components/common';
import Colors from '@theme/colors';
import { connect } from 'react-redux';

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
    const { userId } = this.props.navigation.state.params || this.props.user.id;

    return (
      <Wrapper bgColor={Colors.background.cream}>
        <NavBar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <Experiences
            id={userId}
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
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(UserExperience);
