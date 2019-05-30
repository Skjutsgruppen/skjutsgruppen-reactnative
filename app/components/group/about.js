import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Modal, Platform, TextInput, ImageEditor } from 'react-native';
import Colors from '@theme/colors';
import { RoundedButton } from '@components/common';
import AddPhoto from '@components/add/photo';
import SectionLabel from '@components/add/sectionLabel';
import CommentBox from '@components/add/commentBox';
import { GROUP_NAME_LIMIT } from '@config/constant';
import { trans } from '@lang/i18n';
import GroupInput from '@components/group/groupInput';

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
  groupInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    paddingRight: 12,
    ...Platform.select({
      ios: {
        paddingTop: 21,
      },
    }),
    textAlignVertical: 'center',
  },
});


class About extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', description: '', photo: '', uri: '' };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    const { name, description, photo } = defaultValue;
    this.setState({ name, description, photo });
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  handleName = (name) => {
    this.setState({ name });
  }

  handleDescription = (description) => {
    this.setState({ description });
  }

  render() {
    return (
      <View>
        <AddPhoto
          defaultPhoto={this.state.photo}
          onSelect={(res) => {
            this.setState({ photo: res.data, uri: res.uri });
          }
          }
        />
        {console.log(this.state.photo)}
        <SectionLabel label={trans('add.name_of_the_group')} color={Colors.text.pink} />
        <GroupInput
          value={this.state.name}
          placeholder={trans('global.write')}
          height={80}
          onChangeText={this.handleName}
          maxLength={GROUP_NAME_LIMIT}
          multiline
          autoFocus
          showTextCount
          inputStyle={{ paddingLeft: 20 }}
        />
        <SectionLabel label={trans('add.what_is_your_group_about')} color={Colors.text.pink} />
        <GroupInput
          value={this.state.description}
          placeholder={trans('global.write')}
          height={150}
          onChangeText={this.handleDescription}
          multiline
          autoFocus
          inputStyle={{ paddingLeft: 20 }}
        />
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          {trans('global.next')}
        </RoundedButton>
      </View>
    );
  }
}

About.propTypes = {
  onNext: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
};

export default About;
