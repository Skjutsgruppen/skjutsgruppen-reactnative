import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomButtom from '@components/common/customButton';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';

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
    paddingHorizontal: 32,
    paddingVertical: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 24,
    marginHorizontal: 24,
  },
});


class Description extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    const { photo } = this.props.user;
    let profile = null;

    if (photo) {
      profile = (<Image source={{ uri: photo }} style={styles.profilePic} />);
    }

    return (
      <View>

        {profile}

        <Text style={styles.title}> {trans('trip.description')}</Text>
        <View>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={4}
            onChangeText={text => this.setState({ text })}
            underlineColorAndroid="transparent"
            value={this.state.text}
          />
        </View>
        <Text style={styles.infoText}>
          {trans('trip.most_important_part_of_movement')}
          <Text style={styles.bold}> {trans('trip.love_to_talk_to_each_other')} </Text>
          {trans('trip.write_about_who_you_are')}
        </Text>
        <CustomButtom
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.button}
        >
          {trans('global.next')}
        </CustomButtom>
      </View>
    );
  }
}

Description.propTypes = {
  user: PropTypes.shape({
    photo: PropTypes.string,
  }).isRequired,
  onNext: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Description);
