import React, { Component } from 'react';
import { View, Text, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MemberItem from '@components/memberItem';
import { Loading } from '@components/common';

const styles = StyleSheet.create({
  returnModalContent: {
    flex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e5e5e5',
    paddingTop: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  closeWrapper: {
    backgroundColor: Colors.background.fullWhite,
  },
  closeModal: {
    padding: 16,
  },
  closeModalText: {
    color: Colors.text.blue,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadMoreBtn: {
    width: 100,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: 8,
    marginVertical: 24,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadMoreText: {
    color: Colors.text.darkGray,
    fontSize: 12,
    textAlign: 'center',
  },
});

class ParticipantsModal extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  loadMore = () => {
    const { groupMembers: { rows, fetchMore }, id } = this.props;

    this.setState({ loading: true }, () => {
      fetchMore({
        variables: { id, offset: rows.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.setState({ loading: false });
          if (!fetchMoreResult || fetchMoreResult.groupMembers.length === 0) {
            return previousResult;
          }

          const newRows =
            previousResult.groupMembers.rows.concat(fetchMoreResult.groupMembers.rows);
          const newCount = fetchMoreResult.groupMembers.count;

          return {
            groupMembers: { ...previousResult.groupMembers, ...{ rows: newRows, count: newCount } },
          };
        },
      });
    });
  };

  renderFooter = (loading) => {
    if (loading) {
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: '#CED0CE',
          }}
        >
          <Loading />
        </View>
      );
    }

    const { groupMembers } = this.props;
    const { rows, count } = groupMembers;

    if (rows.length >= count) {
      return null;
    }

    return (
      <TouchableOpacity onPress={this.loadMore} style={styles.loadMoreBtn}>
        <Text style={styles.loadMoreText}>Load More...</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { groupMembers, onPress, setModalVisibility, showFofModal } = this.props;

    return (
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisibility(false)}
        visible={showFofModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', paddingTop: 16 }}>
          <View style={styles.returnModalContent}>
            <FlatList
              data={groupMembers.rows}
              renderItem={
                ({ item }) => (
                  <MemberItem onPress={onPress} user={item} key={item.id} />
                )
              }
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0}
              ListFooterComponent={() => this.renderFooter(this.state.loading)}
            />
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() =>
                  setModalVisibility(false)}
              >
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

ParticipantsModal.propTypes = {
  id: PropTypes.number.isRequired,
  groupMembers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape()),
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
  showFofModal: PropTypes.bool.isRequired,
};

export default ParticipantsModal;
