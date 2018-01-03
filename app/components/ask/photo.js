import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Camera from '@components/camera';
import CustomButton from '@components/common/customButton';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1ca9e5',
    marginHorizontal: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  addPhotoIcon: {
    width: 100,
    height: 64,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginRight: 12,
    marginTop: 12,
  },
  gardenIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginRight: 12,
    marginTop: 16,
  },
  infoText: {
    alignSelf: 'center',
    width: 280,
    paddingHorizontal: 32,
    marginTop: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoTextWider: {
    width: 310,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    margin: 24,
  },
});


class Photo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { photo: '' };
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    return (
      <View>
        <View style={styles.addPhoto}>
          <Camera onSelect={res => this.setState({ photo: res.data })}>
            <View>
              <Text style={styles.title}>{trans('trip.add_photo_to_ride')}</Text>
              <Image source={require('@icons/icon_add_photo.png')} style={styles.addPhotoIcon} />
            </View>
          </Camera>
        </View>
        <Text style={styles.infoText}>
          {trans('trip.ride_visible_by_adding_photo')}
        </Text>
        <Image source={require('@icons/icon_garden.png')} style={styles.gardenIcon} />
        <Text style={[styles.infoText, styles.infoTextWider]}>
          {trans('trip.add_photo_after_supporting_garden')}
        </Text>
        <CustomButton
          onPress={this.onNext}
          bgColor={Colors.background.darkCyan}
          style={styles.button}
        >
          {
            this.state.photo ? trans('global.next') : trans('trip.go_on_without_photo')
          }
        </CustomButton>
      </View>
    );
  }
}

Photo.propTypes = {
  onNext: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Photo);
