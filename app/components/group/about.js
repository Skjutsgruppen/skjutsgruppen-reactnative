import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import Colors from '@theme/colors';
import CustomButton from '@components/common/customButton';
import Camera from '@components/camera';
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
  buttonWrapper: {
    padding: 8,
    marginBottom: 48,
    marginTop: 12,
    marginHorizontal: 24,
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
        <Text style={styles.title}>About</Text>
        <View style={styles.addPhotoWrapper}>
          <Camera onSelect={res => this.setState({ photo: res.data })}>
            <View style={styles.addPhoto}>
              <Image source={require('@assets/icons/icon_add_photo.png')} style={styles.addPhotoIcon} />
              <Text style={styles.addPhotoLabel}>Add a group photo</Text>
            </View>
          </Camera>
        </View>
        <View>
          <Text style={styles.label}>Name of the group</Text>
          <View>
            <TextInput
              style={styles.input}
              onChangeText={name => this.setState({ name })}
              underlineColorAndroid="transparent"
              maxLength={GROUP_NAME_LIMIT}
            />
          </View>
          <Text style={styles.text}>
            Examples: “The soccer group” or “We who commute together”
            or what ever you like :)
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Description</Text>
          <View>
            <TextInput
              style={styles.textarea}
              multiline
              numberOfLines={4}
              onChangeText={description => this.setState({ description })}
              underlineColorAndroid="transparent"
            />
          </View>
        </View>
        <Text style={styles.text}>Describe the purpose of the group.</Text>
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.buttonWrapper}
        >
          Next
        </CustomButton>
      </View>
    );
  }
}

About.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default About;
