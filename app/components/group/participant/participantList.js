import React, { Component } from 'react';
import { StyleSheet, Modal, View, Platform } from 'react-native';
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
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';

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
    backgroundColor: Colors.background.fullWhite,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
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
      error: false,
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
        this.setState({ confirmModalVisibility: false, loading: false, error: false });
      })
      .catch(err => this.setState({ confirmModalVisibility: true, loading: false, error: err }));
  }

  renderButton = () => (
    <RoundedButton
      onPress={() => this.onAddParticipant()}
      bgColor={Colors.background.pink}
      style={styles.button}
    >
      {trans('global.add')}
    </RoundedButton>
  )

  renderModal() {
    const { confirmModalVisibility, participant, loading, error } = this.state;

    const message = (
      <AppText>
        {trans('group.are_you_sure_you_want_to_remove')}
        <AppText fontVarition="bold"> {participant.firstName} {participant.lastName} </AppText>
        {trans('group.from_participants')}
      </AppText>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={confirmModalVisibility}
        onRequestClose={() => this.setConfirmModalVisibility(false)}
        message={message}
        confirmLabel={error ? trans('global.retry') : trans('global.yes')}
        denyLabel={trans('global.no')}
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
        {!isSearching && <Toolbar title={trans('group.participants')} />}
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
