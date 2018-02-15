import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddPhoto from '@components/add/photo';
import CommentBox from '@components/add/commentBox';
import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#dddddd',
  },
  addPhotoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  addPhotoLabelSmall: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  textarea: {
    height: 100,
    backgroundColor: '#ffffff',
    borderWidth: 0,
    padding: 12,
    marginVertical: 16,

  },
  infoText: {
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
    color: Colors.text.gray,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    alignSelf: 'center',
    width: '50%',
    marginTop: '15%',
    marginBottom: 80,
    marginHorizontal: 20,
  },
});


class Description extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '', photo: null };
  }

  componentWillMount() {
    const { text, photo } = this.props.defaultDescription;
    this.setState({ text, photo });
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    const { photo } = this.state;

    return (
      <View>
        <AddPhoto onSelect={res => this.setState({ photo: res.data })} iconColor="blue" defaultPhoto={photo} />
        <CommentBox
          label="Comment"
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          labelColor={Colors.text.blue}
        />
        <Text style={styles.infoText}>
          Write about who you are and where you are going.
          You can also include what vehicle you have,
          if you offer your seats for free or want to share the costs equally.
        </Text>
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

Description.propTypes = {
  defaultDescription: PropTypes.shape({
    text: PropTypes.string,
    photo: PropTypes.string,
  }),
  onNext: PropTypes.func.isRequired,
};

Description.defaultProps = {
  defaultDescription: {
    text: '',
    photo: null,
  },
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Description);
