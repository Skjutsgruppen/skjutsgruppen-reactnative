import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import GroupsList from '@components/profile/groupsList';
import { withMyGroups } from '@services/apollo/group';
import PropTypes from 'prop-types';
import { Wrapper, FloatingNavbar } from '@components/common';
import Colors from '@theme/colors';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.background.lightGray,
    paddingBottom: 12,
  },
});

const Groups = withMyGroups(GroupsList);

class UserGroups extends Component {
  static navigationOptions = {
    header: null,
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { userId, username } = this.props.navigation.state.params || this.props.user.id;

    return (
      <Wrapper bgColor={Colors.background.creme}>
        <FloatingNavbar
          handleBack={this.goBack}
          transparent={false}
          title={`${username}'s Group`}
        />
        <View style={styles.listWrapper}>
          <Groups id={userId} />
        </View>
      </Wrapper>
    );
  }
}

UserGroups.propTypes = {
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

export default connect(mapStateToProps)(UserGroups);
