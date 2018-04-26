import React, { Component } from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@theme';
import DataList from '@components/dataList';
import { Wrapper, ConfirmModal, RoundedButton } from '@components/common';
import { compose } from 'react-apollo';
import Toolbar from '@components/utils/toolbar';
import Item from '@components/group/membershipRequest/membershipRequestItem';
import { withAcceptGroupRequest, withRejectGroupInvitation } from '@services/apollo/notification';
import { withNavigation } from 'react-navigation';
import { AppText } from '@components/utils/texts';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
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
});

class MembershipRequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptConfirmModalVisibility: false,
      rejectConfirmModalVisibility: false,
      acceptId: '',
      rejectId: '',
    };
  }

  componentWillMount() {
    const { id, subscribeToNewRequest } = this.props;
    subscribeToNewRequest({ id });
  }

  onAccept = () => {
    const { acceptGroupRequest, membershipRequest, navigation } = this.props;
    const { acceptId } = this.state;
    let id = null;

    if (!acceptId) {
      id = membershipRequest.rows.map(row => row.id);
    } else {
      id = [acceptId];
    }

    acceptGroupRequest(id)
      .then(() => {
        this.setState({ acceptConfirmModalVisibility: false });
        if (!acceptId) {
          navigation.goBack();
        }
      });
  }

  onReject = () => {
    const { rejectGroupInvitation } = this.props;
    const { rejectId } = this.state;

    rejectGroupInvitation(rejectId)
      .then(() => this.setState({ rejectConfirmModalVisibility: false }));
  }

  setAcceptConfirmModalVisibility = (id) => {
    this.setState({ acceptConfirmModalVisibility: true, acceptId: id });
  }

  setRejectConfirmModalVisibility = (id) => {
    this.setState({ rejectConfirmModalVisibility: true, rejectId: id });
  }

  renderAcceptModal() {
    const { acceptConfirmModalVisibility } = this.state;
    const { membershipRequest: { loading } } = this.props;

    const message = (
      <AppText>{trans('group.are_you_sure_you_want_to_add_participants')}</AppText>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={acceptConfirmModalVisibility}
        onRequestClose={() => this.setState({ acceptConfirmModalVisibility: false })}
        message={message}
        confirmLabel={trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={this.onAccept}
        onDeny={() => this.setState({ acceptConfirmModalVisibility: false })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderRejectModal() {
    const { rejectConfirmModalVisibility } = this.state;
    const { membershipRequest: { loading } } = this.props;

    const message = (
      <AppText>{trans('group.are_you_sure_you_want_to_reject')}</AppText>
    );

    return (
      <ConfirmModal
        loading={loading}
        visible={rejectConfirmModalVisibility}
        onRequestClose={() => this.setState({ rejectConfirmModalVisibility: false })}
        message={message}
        confirmLabel={trans('global.yes')}
        denyLabel={trans('global.no')}
        onConfirm={this.onReject}
        onDeny={() => this.setState({ rejectConfirmModalVisibility: false })}
        confrimTextColor={Colors.text.blue}
      />
    );
  }

  renderButton = () => (
    <RoundedButton
      onPress={() => this.setAcceptConfirmModalVisibility()}
      bgColor={Colors.background.pink}
      style={styles.button}
    >
      {trans('group.yes_to_all')}
    </RoundedButton>
  );


  render() {
    const { membershipRequest } = this.props;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        onRequestClose={() => { }}
        visible
      >
        <Wrapper>
          <Toolbar title={trans('group.asking_to_participate')} />
          <DataList
            data={membershipRequest}
            header={this.renderListSearch}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item, index }) => (
              <Item
                key={item.id}
                request={item}
                position={index}
                onAccept={this.setAcceptConfirmModalVisibility}
                onReject={this.setRejectConfirmModalVisibility}
              />
            )}
            noResultText={trans('group.no_any_group_membership_request')}
            fetchMoreOptions={{
              variables: { offset: membershipRequest.rows.length },
              updateQuery: (previousResult, { moreResult }) => {
                if (!moreResult || moreResult.membershipRequest.rows.length === 0) {
                  return previousResult;
                }

                const rows = previousResult.membershipRequest.rows
                  .concat(moreResult.membershipRequest.rows);

                return { membershipRequest: { ...previousResult.membershipRequest, ...{ rows } } };
              },
            }}
          />
          {membershipRequest.count > 0 &&
            <View style={styles.footer}>
              {this.renderButton()}
            </View>
          }
          {this.renderAcceptModal()}
          {this.renderRejectModal()}
        </Wrapper>
      </Modal>
    );
  }
}

MembershipRequestList.propTypes = {
  id: PropTypes.number.isRequired,
  membershipRequest: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        User: PropTypes.shape({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
        }).isRequired,
        id: PropTypes.number.isRequired,
      }),
    ),
    count: PropTypes.number.isRequired,
  }).isRequired,
  acceptGroupRequest: PropTypes.func.isRequired,
  rejectGroupInvitation: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  subscribeToNewRequest: PropTypes.func.isRequired,
};

export default compose(
  withAcceptGroupRequest,
  withRejectGroupInvitation,
  withNavigation,
)(MembershipRequestList);
