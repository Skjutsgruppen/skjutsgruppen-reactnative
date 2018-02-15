import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import ParticipantsModal from '@components/participantsModal';
import { Loading } from '@components/common';
import { withGroupMembers } from '@services/apollo/group';
import { withNavigation } from 'react-navigation';

const ParticipantsInModal = withGroupMembers(ParticipantsModal);

const imageSize = 48;
const margin = 12;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    height: imageSize,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  profilePic: {
    width: imageSize,
    height: imageSize,
    resizeMode: 'cover',
    borderRadius: imageSize / 2,
    borderWidth: 4,
    borderColor: Colors.border.white,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  remainingCount: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    position: 'absolute',
    top: 0,
    backgroundColor: Colors.background.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.border.white,
  },
  count: {
    fontSize: 14,
    color: Colors.text.white,
  },
});

class Participants extends Component {
  constructor(props) {
    super(props);
    this.state = { showFoFModal: false };
  }

  componentWillMount() {
    const { subscribeToUpdatedGroupMember, id } = this.props;
    subscribeToUpdatedGroupMember({ id });
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
    const { id } = this.props;

    return (
      <ParticipantsInModal
        id={id}
        offset={0}
        onPress={this.onPress}
        setModalVisibility={this.setModalVisibility}
        showFoFModal={this.state.showFoFModal}
      />
    );
  }

  render() {
    const { groupMembers: { count, rows, loading } } = this.props;
    if (loading) {
      return (<Loading />);
    }

    const { width } = Dimensions.get('window');
    const maxImage = parseInt(((width - 32) / 36), 0);
    let zIndex = maxImage;
    const membersToRender = rows.filter((member, index) => index <= maxImage - 1 && member);
    const warpperWidth = rows.length > maxImage ? 36 * maxImage : 36 * rows.length;

    if (count <= maxImage) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => this.setModalVisibility(true)}
          >
            <View style={{ justifyContent: 'center', backgroundColor: '#fff' }}>
              <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
                {
                  membersToRender.map((member, index) => {
                    zIndex -= 1;

                    return (
                      <Image
                        source={{ uri: member.avatar }}
                        style={[
                          styles.profilePic,
                          index > 0 && { left: (index * imageSize) - (margin * index) },
                          { zIndex },
                        ]}
                        key={member.id}
                      />
                    );
                  })
                }
              </View>
            </View>
          </TouchableOpacity>
          {this.state.showFoFModal && this.renderModal()}
        </View>
      );
    }

    return (
      <View>
        <TouchableOpacity
          onPress={() => this.setModalVisibility(true)}
        >
          <View style={{ justifyContent: 'center', backgroundColor: '#fff' }}>
            <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
              {
                membersToRender.map((member, index) => {
                  zIndex -= 1;
                  if (index < membersToRender.length - 1) {
                    return (
                      <Image
                        source={{ uri: member.avatar }}
                        style={[
                          styles.profilePic,
                          index > 0 && { left: (index * imageSize) - (margin * index) },
                          { zIndex },
                        ]}
                        key={member.id}
                      />
                    );
                  }

                  return (
                    <View
                      style={[
                        styles.remainingCount,
                        index > 0 && { left: (index * imageSize) - (margin * index) },
                        { zIndex },
                      ]}
                      key={member.id}
                    >
                      <Text style={styles.count}>
                        +{
                          (rows.length > maxImage)
                            ? (count - (maxImage - 1))
                            : (count - rows.length) + 1
                        }
                      </Text>
                    </View>
                  );
                })
              }
            </View>
          </View>
        </TouchableOpacity>
        {this.state.showFoFModal && this.renderModal()}
      </View>
    );
  }
}

Participants.propTypes = {
  id: PropTypes.number.isRequired,
  groupMembers: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      avatar: PropTypes.string,
    })),
    count: PropTypes.number,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  subscribeToUpdatedGroupMember: PropTypes.func.isRequired,
};

export default withNavigation(Participants);
