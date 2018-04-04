import React, { Component } from 'react';
import { StyleSheet, Text, Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import { Colors } from '@theme';
import { compose } from 'react-apollo';
import { Wrapper, ConfirmModal, ListSearchBar, RoundedButton } from '@components/common';
import Item from '@components/group/enablers/addEnablerItem';
import Toolbar from '@components/utils/toolbar';
import ListSearchModal from '@components/profile/ListSearchModal';
import { withAddGroupEnabler } from '@services/apollo/group';
import { withNavigation } from 'react-navigation';
import Toast from '@components/toast';
import { getToast } from '@config/toast';

const styles = StyleSheet.create({
  errorText: {
    textAlign: 'center',
    color: Colors.text.red,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    elevation: 10,
    backgroundColor: Colors.background.fullWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    marginBottom: 0,
  },
  wrapper: {
    backgroundColor: Colors.background.fullWhite,
    flex: 1,
  },
});

class AddEnabler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmModalVisibility: false,
      participants: [],
      loading: false,
      refetch: null,
      error: '',
      isSearchModalOpen: false,
      unfriend: false,
    };
  }

  onSelect = (participant) => {
    const { participants } = this.state;
    let newParticipants = [];

    newParticipants = participants.filter(user => user.id === participant.id);

    if (newParticipants.length < 1) {
      newParticipants = participants.concat(participant);
    } else {
      newParticipants = participants.filter(user => user.id !== participant.id);
    }

    this.setState({ participants: newParticipants });
  }

  onAddEnabler = () => {
    const { addGroupEnablers, id, navigation } = this.props;
    const { participants } = this.state;
    this.setState({ loading: true });

    addGroupEnablers({ ids: participants.map(participant => participant.id), groupId: id })
      .then(() => {
        this.setState({ confirmModalVisibility: false, loading: false, error: false });
        navigation.goBack();
      })
      .catch(() => this.setState({ confirmModalVisibility: true, loading: false, error: true }));
  }

  onPress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('Profile', { profileId: id });
  }

  setConfirmModalVisibility = (show) => {
    if (show) {
      if (this.state.participants.length < 1) {
        this.setState({ error: getToast(['SELECT_ONE_USER']) });
      } else {
        this.setState({ confirmModalVisibility: true, error: '' });
      }
    } else {
      this.setState({ confirmModalVisibility: false, error: '' });
    }
  }

  checkIfParticipantIsSelected = (participant) => {
    const { participants } = this.state;
    const selectedParticipants = participants.filter(user => user.id === participant.User.id);

    return selectedParticipants.length === 1;
  }

  renderButton = () => (
    <RoundedButton
      onPress={() => this.setConfirmModalVisibility(true)}
      bgColor={Colors.background.pink}
      style={styles.button}
    >
      Add
    </RoundedButton>
  );

  renderModal() {
    const { confirmModalVisibility, loading, error, participants } = this.state;
    let separator = '';

    const participantsName = participants.map((participant, index) => {
      if (index > 3) {
        return null;
      }

      if (index > 0 && index === (participants.length - 1) && participants.length < 3) {
        separator = ' and ';
      } else if (index > 0) {
        separator = ', ';
      }

      return (
        <Text key={participant.id} style={styles.boldText}>
          {separator}{participant.firstName}
        </Text>
      );
    });

    const message = (
      <Text>
        Are you sure you want to add {participantsName} {participants.length > 3 ? ' and others ' : ''} as enablers?
      </Text>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={error !== '' ? 'Retry' : 'Yes'}
        denyLabel="No"
        onConfirm={() => this.onAddEnabler()}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderListSearch = () => {
    const { groupMembers, isSearching } = this.props;

    if (isSearching) return (<View style={{ height: 24 }} />);

    if (groupMembers.count > 0) {
      return (<ListSearchBar onSearchPress={() => this.setState({ isSearchModalOpen: true })} />);
    }

    return null;
  }

  renderSearchModal = () => {
    const { id } = this.props;

    return (
      <Modal
        visible={this.state.isSearchModalOpen}
        onRequestClose={() => this.setState({ isSearchModalOpen: false })}
        animationType="slide"
      >
        <ListSearchModal
          id={id}
          onPress={() => { }}
          onClose={() => this.setState({ isSearchModalOpen: false })}
          searchCategory="addEnabler"
        />
      </Modal>
    );
  }

  render() {
    const { groupMembers, isSearching, queryString } = this.props;

    if (isSearching && !queryString) {
      return null;
    }

    return (
      <Wrapper>
        {!isSearching && <Toolbar title="Add Enablers" />}
        <Toast message={this.state.error} type="error" />
        <DataList
          data={groupMembers}
          header={this.renderListSearch}
          renderItem={({ item }) => (
            <Item
              key={item.id}
              member={item}
              onPress={this.onPress}
              onSelect={this.onSelect}
              error={() => { }}
              active={this.checkIfParticipantIsSelected(item)}
            />
          )}
          noResultText={'No any participant to add as enabler.'}
          fetchMoreOptions={{
            variables: { offset: groupMembers.rows.length },
            updateQuery: (previousResult, { newResult }) => {
              if (!newResult || newResult.groupMembers.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.groupMembers.rows.concat(newResult.groupMembers.rows);

              return { groupMembers: { ...previousResult.groupMembers, ...{ rows } } };
            },
          }}
        />
        {groupMembers.rows.length > 0 &&
          <View style={styles.footer}>
            {this.renderButton()}
          </View>
        }
        {this.renderModal()}
        {!isSearching && this.renderSearchModal()}
      </Wrapper>
    );
  }
}

AddEnabler.propTypes = {
  id: PropTypes.number.isRequired,
  groupMembers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      avatar: PropTypes.string,
    })),
    count: PropTypes.number,
  }).isRequired,
  addGroupEnablers: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  queryString: PropTypes.string,
  isSearching: PropTypes.bool,
};

AddEnabler.defaultProps = {
  queryString: '',
  isSearching: false,
};

export default compose(withNavigation, withAddGroupEnabler)(AddEnabler);
