import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withGroup } from '@services/apollo/group';
import GroupDetails from '@components/group/editGroup';

const Group = withGroup(GroupDetails);

class EditGroupScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    const { navigation } = this.props;
    const { id } = navigation.state.params;

    return (<Group id={id} />);
  }
}

EditGroupScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default EditGroupScreen;
