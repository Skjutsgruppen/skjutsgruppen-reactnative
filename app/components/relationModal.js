import React from 'react';
import { View, Text, Modal, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import MemberItem from '@components/memberItem';

const styles = StyleSheet.create({
  returnModalContent: {
    maxHeight: '90%',
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
});

const RelationModal = ({ users, onPress, setModalVisibility, showFofModal }) => (
  <Modal
    animationType="slide"
    transparent
    onRequestClose={() => setModalVisibility(false)}
    visible={showFofModal}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', paddingTop: 16, justifyContent: 'flex-end' }}>
      <View style={styles.returnModalContent}>
        <FlatList
          data={users}
          renderItem={
            ({ item }) => (
              <MemberItem onPress={onPress} user={item} key={item.id} />
            )
          }
          keyExtractor={(item, index) => index}
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

RelationModal.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()),
  onPress: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired,
  showFofModal: PropTypes.bool.isRequired,
};

RelationModal.defaultProps = {
  users: [],
};

export default RelationModal;
