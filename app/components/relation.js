import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import RelationModal from '@components/relationModal';
import RelationBubbleList from '@components/relationBubbleList';
import { withNavigation } from 'react-navigation';

class Relation extends Component {
  constructor(props) {
    super(props);
    this.state = { showFofModal: false };
  }

  onPress = (userId) => {
    const { navigation } = this.props;

    this.setState({ showFofModal: false });
    navigation.navigate('UserProfile', { profileId: userId });
  }

  setModalVisibility = (show) => {
    this.setState({ showFofModal: show });
  }

  renderModal() {
    const { users } = this.props;

    return (
      <RelationModal
        users={users}
        onPress={this.onPress}
        setModalVisibility={this.setModalVisibility}
        showFofModal={this.state.showFofModal}
      />
    );
  }

  render() {
    const { users, avatarSize, style } = this.props;
    if (!users || users.length < 1) {
      return null;
    }

    if (users.length < 1) {
      return null;
    }

    return (
      <View>
        <RelationBubbleList
          users={users}
          avatarSize={avatarSize}
          style={style}
          setModalVisibility={this.setModalVisibility}
        />
        {this.state.showFofModal && this.renderModal()}
      </View>
    );
  }
}

Relation.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  avatarSize: PropTypes.number,
  style: View.propTypes.style,
};

Relation.defaultProps = {
  users: null,
  avatarSize: 45,
  style: {},
};

export default withNavigation(Relation);
