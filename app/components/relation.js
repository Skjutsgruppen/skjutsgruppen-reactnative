import React, { Component } from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import RelationModal from '@components/relationModal';
import RelationBubbleList from '@components/relationBubbleList';
import { withNavigation } from 'react-navigation';

class Relation extends Component {
  constructor(props) {
    super(props);
    this.state = { showFoFModal: false };
  }

  onPress = (userId) => {
    const { navigation } = this.props;

    this.setState({ showFoFModal: false });
    navigation.navigate('Profile', { profileId: userId });
  }

  setModalVisibility = (show) => {
    this.setState({ showFoFModal: show });
  }

  renderModal() {
    const { users } = this.props;

    return (
      <RelationModal
        users={users}
        onPress={this.onPress}
        setModalVisibility={this.setModalVisibility}
        showFoFModal={this.state.showFoFModal}
      />
    );
  }

  render() {
    const { users, avatarSize, style } = this.props;

    if (users && users.length > 0) {
      return (
        <View>
          <RelationBubbleList
            users={users}
            avatarSize={avatarSize}
            style={style}
            setModalVisibility={this.setModalVisibility}
          />
          {this.state.showFoFModal && this.renderModal()}
        </View>
      );
    }

    return null;
  }
}

Relation.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
  avatarSize: PropTypes.number,
  style: ViewPropTypes.style,
};

Relation.defaultProps = {
  users: null,
  avatarSize: 45,
  style: {},
};

export default withNavigation(Relation);
