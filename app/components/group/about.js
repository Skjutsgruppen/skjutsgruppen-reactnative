import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Colors from '@theme/colors';
import { RoundedButton } from '@components/common';
import AddPhoto from '@components/add/photo';
import CommentBox from '@components/add/commentBox';
import { GROUP_NAME_LIMIT } from '@config/constant';

const styles = StyleSheet.create({
  addPhotoWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#dddddd',
    marginBottom: 24,
  },
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPhotoIcon: {
    width: 90,
    height: 60,
    resizeMode: 'contain',
    marginRight: 12,
  },
  addPhotoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 6,
    paddingHorizontal: 24,
  },
  input: {
    backgroundColor: '#ffffff',
    height: 45,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  textarea: {
    height: 100,
    backgroundColor: '#ffffff',
    borderWidth: 0,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
    color: '#777',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
    width: '50%',
    marginTop: '15%',
    marginBottom: 80,
    marginHorizontal: 20,
  },
});


class About extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', description: '', photo: '' };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    return (
      <View>
        <AddPhoto onSelect={res => this.setState({ photo: res.data })} />
        <CommentBox
          label="Name of the group"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
          maxLength={GROUP_NAME_LIMIT}
        />
        <CommentBox
          label="What is your group about?"
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
        />
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Next
        </RoundedButton>
      </View>
    );
  }
}

About.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default About;
