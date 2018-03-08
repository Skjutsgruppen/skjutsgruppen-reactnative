import React, { Component } from 'react';
import { StyleSheet, Text, Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import DataList from '@components/dataList';
import { Colors } from '@theme';
import { Wrapper, ConfirmModal, ListSearchBar, RoundedButton } from '@components/common';
import Participant from '@components/group/participant/participantItem';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';
import Toolbar from '@components/utils/toolbar';
import ListSearchModal from '@components/profile/ListSearchModal';
import { withRemoveGroupParticipant } from '@services/apollo/group';
import { withNavigation } from 'react-navigation';

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

class ParticipantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmModalVisibility: false,
      canDelete: false,
      participant: {},
      isSearchModalOpen: false,
      loading: false,
    };
  }

  componentWillMount() {
    const { isAdmin, id, subscribeToUpdatedGroupMember } = this.props;
    this.setState({ canDelete: isAdmin });
    subscribeToUpdatedGroupMember({ id, enabler: false });
  }

  onAddParticipant = () => {
    const { navigation } = this.props;
    navigation.navigate('AddParticipant', { group: navigation.state.params.group });
  }

  onPress = (id) => {
    const { navigation } = this.props;
    navigation.navigate('Profile', { profileId: id });
  }

  onRemovePress = (user) => {
    this.setState({ participant: user, confirmModalVisibility: true });
  }

  setConfirmModalVisibility = (show) => {
    this.setState({ confirmModalVisibility: show });
  }

  removeParticipant = () => {
    const { removeGroupParticipant, id } = this.props;
    const { participant } = this.state;
    this.setState({ loading: true });

    removeGroupParticipant({ groupId: id, ids: [participant.id] })
      .then(() => {
        this.setState({ confirmModalVisibility: false, loading: false });
      })
      .catch(err => console.warn(err));
  }

  renderButton = () => (
    <RoundedButton
      onPress={() => this.onAddParticipant()}
      bgColor={Colors.background.pink}
      style={styles.button}
    >
      Add
    </RoundedButton>
  )

  renderModal() {
    const { confirmModalVisibility, participant, loading } = this.state;

    const message = (
      <Text>
        Are you sure you want to remove
        <Text style={styles.boldText}> {participant.firstName} {participant.lastName} </Text>
        from participants?
      </Text>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={'Yes'}
        denyLabel="No"
        onConfirm={this.removeParticipant}
        onDeny={() => this.setConfirmModalVisibility(false)}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderListSearch = () => {
    const { groupMembers, isSearching } = this.props;

    if (isSearching) return (<View style={{ height: 32 }} />);

    if (groupMembers.count > 0) {
      return (<ListSearchBar onSearchPress={() => this.setState({ isSearchModalOpen: true })} />);
    }

    return null;
  }

  renderSearchModal = () => {
    const { id, isAdmin } = this.props;

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
          searchCategory="participants"
          unfriend={false}
          isAdmin={isAdmin}
        />
      </Modal>
    );
  }

  render() {
    const { groupMembers, queryString, isSearching, user } = this.props;

    if (isSearching && !queryString) {
      return null;
    }

    return (
      <Wrapper>
        {!isSearching && <Toolbar title="Participants" />}
        <DataList
          data={groupMembers}
          header={this.renderListSearch}
          renderItem={({ item }) => (
            <Participant
              key={item.id}
              canDelete={this.state.canDelete}
              participant={item}
              onPress={this.onPress}
              handleRemovePress={this.onRemovePress}
              error={() => { }}
              userId={user.id}
            />
          )}
          fetchMoreOptions={{
            variables: { offset: groupMembers.rows.length },
            updateQuery: (previousResult, { moreResult }) => {
              if (!moreResult || moreResult.groupMembers.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.groupMembers.rows.concat(moreResult.groupMembers.rows);

              return { groupMembers: { ...previousResult.groupMembers, ...{ rows } } };
            },
          }}
        />
        {this.state.canDelete && !isSearching &&
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

ParticipantList.propTypes = {
  id: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  groupMembers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      avatar: PropTypes.string,
    })),
    count: PropTypes.number,
  }).isRequired,
  removeGroupParticipant: PropTypes.func.isRequired,
  subscribeToUpdatedGroupMember: PropTypes.func.isRequired,
  isSearching: PropTypes.bool,
  queryString: PropTypes.string,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

ParticipantList.defaultProps = {
  isSearching: false,
  queryString: '',
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withRemoveGroupParticipant,
  withNavigation,
  connect(mapStateToProps),
)(ParticipantList);
