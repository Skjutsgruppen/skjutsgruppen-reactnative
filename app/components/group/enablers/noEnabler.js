import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { Wrapper, RoundedButton, Loading } from '@components/common';
import { Colors } from '@theme';
import { compose } from 'react-apollo';
import { withAddGroupEnabler } from '@services/apollo/group';
import { connect } from 'react-redux';

import BackIcon from '@assets/icons/ic_back_white_toolbar.png';

const styles = StyleSheet.create({
  whiteText: {
    color: Colors.text.white,
    fontSize: 16,
    marginVertical: 12,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 54,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIconWrapper: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  groupImage: {
    width: 210,
    height: 210,
    resizeMode: 'cover',
    borderRadius: 105,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 18,
  },
  button: {
    paddingHorizontal: 32,
    width: '50%',
    marginTop: 32,
  },
});

class NoEnabler extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  onAddEnabler = () => {
    const { addGroupEnablers, group, user, onAdd } = this.props;
    this.setState({ loading: true }, () => {
      addGroupEnablers({ groupId: group.id, ids: [user.id], self: true })
        .then(() => {
          onAdd();
        });
    });
  }

  renderButton = () => {
    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <RoundedButton
        onPress={() => this.onAddEnabler()}
        bgColor={Colors.background.pink}
        style={styles.button}
      >
        I can do it!
      </RoundedButton>
    );
  }

  render() {
    const { group, navigation } = this.props;

    return (
      <Wrapper bgColor={Colors.background.darkGray}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <View style={styles.backIconWrapper}>
              <Image source={BackIcon} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.content}>
            <Image
              source={{ uri: group.photo ? group.photo : group.mapPhoto }}
              style={styles.groupImage}
            />
            <Text style={[styles.whiteText, styles.title]}>{group.name}</Text>
            <Text style={styles.whiteText}>
              For this group to work one or more participants needs to enable it.
            </Text>
            <Text style={styles.whiteText}>
              Press below to be an enabler of this group.
            </Text>
            {
              this.renderButton()
            }
          </View>
        </ScrollView>
      </Wrapper>
    );
  }
}

NoEnabler.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  addGroupEnablers: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  withAddGroupEnabler,
  withNavigation,
  connect(mapStateToProps),
)(NoEnabler);

