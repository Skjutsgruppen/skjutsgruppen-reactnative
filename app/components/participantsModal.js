import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';
import MemberItem from '@components/memberItem';
import DataList from '@components/dataList';
import { trans } from '@lang/i18n';

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

const ParticipantsModal = ({ groupMembers, onPress, setModalVisibility, showFoFModal }) => (
  <Modal
    animationType="slide"
    transparent
    onRequestClose={() => setModalVisibility(false)}
    visible={showFoFModal}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', paddingTop: 16 }}>
      <View style={styles.returnModalContent}>
        <DataList
          data={groupMembers}
          renderItem={({ item }) => (
            <MemberItem
              onPress={onPress}
              user={item}
              key={item.id}
            />
          )}
          fetchMoreOptions={{
            variables: { offset: groupMembers.rows.length },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult || fetchMoreResult.groupMembers.rows.length === 0) {
                return previousResult;
              }

              const rows = previousResult.groupMembers.rows.concat(
                fetchMoreResult.groupMembers.rows,
              );

              return { groupMembers: { ...previousResult.groupMembers, ...{ rows } } };
            },
          }}
        />
        <View style={styles.closeWrapper}>
          <TouchableOpacity
            style={styles.closeModal}
            onPress={() =>
              setModalVisibility(false)}
          >
            <AppText centered fontVariation="bold" color={Colors.text.blue}>{trans('global.close')}</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

ParticipantsModal.propTypes = {
  groupMembers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape()),
    count: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
  showFoFModal: PropTypes.bool.isRequired,
};

export default ParticipantsModal;
