import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import Camera from '../camera';

const styles = StyleSheet.create({
  addPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: '#dddddd',
    marginBottom: 24,
  },
  addPhotoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginVertical: 4,
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
    marginBottom: 24,
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
        <View style={styles.addPhoto}>
          <Camera onSelect={res => this.setState({ photo: res.data })}>
            <View>
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
            />
          </View>
          <Text style={styles.text}>Examples: “The soccer group” or “We who commute together” or what ever you like :)</Text>
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
        <View style={styles.buttonWrapper}>
          <Button
            onPress={this.onNext}
            title="Next"
            accessibilityLabel="Go to next form"
            color="#38ad9e"
          />
        </View>
      </View>
    );
  }
}

About.propTypes = {
  onNext: PropTypes.func.isRequired,
};

export default About;
