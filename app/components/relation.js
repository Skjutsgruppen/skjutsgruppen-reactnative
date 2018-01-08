import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import RelationshipItem from '@components/relationItem';
import Colors from '@theme/colors';
import PlaceHolder from '@assets/profilePic.jpg';

const styles = StyleSheet.create({
  participantWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  returnModalContent: {
    position: 'absolute',
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
    marginTop: 32,
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
      <Modal
        animationType="slide"
        transparent
        onRequestClose={() => this.setState({ showFofModal: false })}
        visible={this.state.showFofModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.85)', paddingTop: 16 }}>
          <View style={styles.returnModalContent}>
            <FlatList
              data={users}
              renderItem={
                ({ item }) => (
                  <RelationshipItem onPress={this.onPress} user={item} key={item.id} />
                )
              }
              keyExtractor={(item, index) => index}
            />
            <View style={styles.closeWrapper}>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() =>
                  this.setModalVisibility(false)}
              >
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
        <TouchableOpacity
          onPress={() => this.setModalVisibility(true)}
          style={[styles.participantWrapper, { marginVertical: avatarSize / 3 }, style]}
        >
          {users.map((user, index) => {
            let image = null;

            if (user.avatar) {
              image = (<Image
                source={{ uri: user.avatar }}
                style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
              />);
            } else {
              image = (<Image
                source={PlaceHolder}
                style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
              />);
            }

            return [
              image,
              ((index + 1) !== users.length) && <Image
                source={require('@assets/icons/icon_arrow_fat.png')}
                style={[styles.arrow, { height: avatarSize / 4, width: avatarSize / 4 }]}
              />,
            ];
          })}
        </TouchableOpacity>
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

export default Relation;
