import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Modal, Alert } from 'react-native';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { getToast } from '@config/toast';
import { FEEDABLE_GROUP, FEEDABLE_TRIP, FEEDABLE_LOCATION } from '@config/constant';
import Date from '@components/date';
import TouchableHighlight from '@components/touchableHighlight';
import Colors from '@theme/colors';
import { TextStyles } from '@theme/styles/global';
import { ModalAction, ActionModal, Loading } from '@components/common';
import Share from '@components/common/share';
import Timer from '@components/common/timer';
import { trans } from '@lang/i18n';
import { UcFirst } from '@config';
import { withShareLocation } from '@services/apollo/share';
import { updateSharedLocation } from '@services/apollo/dataSync';

const styles = StyleSheet.create({
  purpleBg: {
    backgroundColor: '#9e049e',
  },
  spacerTop: {
    marginTop: 8,
  },
  spacerBottom: {
    paddingVertical: 16,
  },
  wrapper: {
    width: '100%',
    maxHeight: '40%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.background.fullWhite,
    elevation: 10,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    overflow: 'hidden',
  },
  groupName: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  row: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sharedLocation: {
    paddingVertical: 0,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 20,
    justifyContent: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  horizontalDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    marginVertical: 12,
    marginLeft: 88,
  },
  timerWrapper: {
    marginLeft: 'auto',
  },
  timer: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingTime: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

class ShareLocation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({
      showShareModal: false,
      showActionOption: false,
      lastLat: null,
      lastLong: null,
      sharedLocations: [],
      myLocation: {},
      myPosition: {},
      location: {},
    });
  }

  componentWillMount() {
    const { data } = this.props.locationSharedToSpecificResource;
    const { detail, myPosition } = this.props;
    const { __typename } = detail;
    this.setState({ sharedLocations: data, myLocation: detail.Location, myPosition });

    this.loadInterval = setInterval(() => {
      updateSharedLocation(detail.id, __typename);
    }, 60000);
  }

  componentWillReceiveProps = ({ detail, locationSharedToSpecificResource, myPosition }) => {
    this.setState({
      myLocation: detail.Location,
      sharedLocations: locationSharedToSpecificResource.data || [],
      myPosition,
    });
  }

  componentWillUnmount() {
    if (this.loadInterval) clearInterval(this.loadInterval);
    this.loadInterval = false;
  }

  onLayout = e => this.props.onLayout(e.nativeEvent.layout.height);

  onShareLocation = (unit) => {
    const { shareLocation, detail, startTrackingLocation } = this.props;
    const { myPosition } = this.state;
    const { __typename } = detail;

    this.setState({ showActionOption: false });

    const obj = {
      point: [myPosition.longitude, myPosition.latitude],
      duration: unit,
      users: [],
    };

    if (__typename === 'Group') {
      obj.groupId = detail.id;
      startTrackingLocation();
      shareLocation(obj)
        .catch((error) => {
          Alert.alert(getToast(error));
        });
    }
    if (__typename === 'Trip') {
      obj.tripId = detail.id;
      this.setState({ location: obj, showShareModal: true });
    }
  }

  info = () => {
    const { type } = this.props;
    if (type === FEEDABLE_GROUP) {
      return this.group();
    }

    if (type === FEEDABLE_TRIP) {
      return this.trip();
    }

    return null;
  }

  trip = () => {
    const { detail } = this.props;

    return (
      <View>
        <View style={[styles.row, styles.spacerTop]}>
          <View style={styles.thumbnail}>
            <Image source={{ uri: detail.User.avatar }} style={styles.avatar} />
          </View>
          <View>
            <Text style={TextStyles.light}>
              {
                detail.TripStart.name ||
                UcFirst(detail.direction)
              } - {detail.TripEnd.name ||
                UcFirst(detail.direction)
              }
            </Text>
            <Text style={TextStyles.light}><Date format="MMM DD, YYYY HH:mm">{detail.date}</Date></Text>
          </View>
        </View>
        <View style={styles.horizontalDivider} />
      </View>
    );
  }

  group = () => {
    const { detail } = this.props;

    return (
      <View style={styles.groupName}>
        <Text style={TextStyles.bold}>{detail.name}</Text>
      </View>
    );
  }

  showActionModal = () => {
    const { showActionOption } = this.state;
    const { fetchingPosition, myPosition } = this.props;

    if (!showActionOption ||
      fetchingPosition ||
      !myPosition.longitude ||
      !myPosition.latitude) return null;

    return (
      <ActionModal
        title="Share live location for:"
        animationType="fade"
        transparent
        onRequestClose={() => this.setState({ showActionOption: false })}
        visible={showActionOption}
      >
        {[
          <ModalAction
            key="thirty_minutes"
            label={trans('interval.thirty_minutes')}
            onPress={() => this.onShareLocation(30)}
          />,
          <ModalAction
            key="four_hours"
            label={trans('interval.four_hours')}
            onPress={() => this.onShareLocation(240)}
          />,
          <ModalAction
            key="eight_hours"
            label={trans('interval.eight_hours')}
            onPress={() => this.onShareLocation(480)}
          />,
        ]}
      </ActionModal>
    );
  }

  renderShareModal() {
    const { showShareModal, location } = this.state;
    const { detail, startTrackingLocation } = this.props;

    return (
      <Modal
        visible={showShareModal}
        onRequestClose={() => this.setState({ showShareModal: false })}
        animationType="slide"
      >
        <Share
          modal={false}
          type={FEEDABLE_LOCATION}
          detail={detail}
          location={location}
          startTrackingLocation={startTrackingLocation}
          onClose={() => this.setState({ showShareModal: false })}
        />
      </Modal>
    );
  }

  renderLocationSharedList = () => {
    const { gotoRegion } = this.props;
    const { sharedLocations } = this.state;

    if (!sharedLocations || (sharedLocations && sharedLocations.length <= 0)) return null;

    return (
      sharedLocations.map(location => (
        <View key={location.id}>
          <TouchableHighlight onPress={() => gotoRegion(location.locationCoordinates)}>
            <View style={[styles.row, styles.sharedLocation]}>
              <View style={styles.thumbnail}>
                <Image source={{ uri: location.User.avatar }} style={styles.smallAvatar} />
              </View>
              <View>
                <Text>
                  <Text style={TextStyles.blue}>
                    {location.User.firstName}
                  </Text> shares location
                </Text>
              </View>
              <Timer timeFraction={location.timeFraction} duration={location.duration} />
            </View>
          </TouchableHighlight>
          <View style={styles.horizontalDivider} />
        </View>
      ))
    );
  }

  renderShareLocation = () => {
    const {
      stopSpecific,
      detail,
      stopTrackingLocation,
      myPosition,
      currentLocation,
      fetchingPosition } = this.props;
    const { myLocation } = this.state;
    const { __typename } = detail;

    return (
      <TouchableHighlight
        onPress={() => {
          if (fetchingPosition) return;
          if (myLocation.id) {
            stopTrackingLocation();
            stopSpecific({ id: detail.id, type: __typename })
              .catch(error => Alert.alert(error.code));
          } else if (!myPosition.latitude || !myPosition.longitude) {
            currentLocation().then(() => this.setState({ showActionOption: true }));
          } else {
            this.setState({ showActionOption: true });
          }
        }}
        style={styles.spacerBottom}
      >
        <View style={styles.row}>
          <View style={[styles.thumbnail, styles.purpleBg]}>
            <Image source={require('@assets/icons/ic_location_white.png')} style={{ alignSelf: 'center' }} />
          </View>
          {!myLocation.id && !fetchingPosition &&
            <View>
              <Text style={TextStyles.blue}>Share my live location for...</Text>
              <Text style={TextStyles.light}>Choose with who and for how long you share</Text>
            </View>
          }
          {!myLocation.id && fetchingPosition &&
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={TextStyles.light}>Fetching your position.</Text><Loading />
            </View>
          }
          {myLocation.id && myLocation.duration > 0 &&
            <View style={[styles.row, { flex: 1, justifyContent: 'space-between' }]}>
              <View>
                <Text style={TextStyles.blue}>Stop sharing Location</Text>
                <Text style={TextStyles.light}>In this {__typename}</Text>
              </View>
              <Timer timeFraction={myLocation.timeFraction} duration={myLocation.duration} />
            </View>
          }
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.wrapper} onLayout={this.onLayout}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.info()}
          {this.renderLocationSharedList()}
          {this.renderShareLocation()}
        </ScrollView>
        {this.showActionModal()}
        {this.renderShareModal()}
      </View>
    );
  }
}

ShareLocation.propTypes = {
  shareLocation: PropTypes.func.isRequired,
  locationSharedToSpecificResource: PropTypes.shape().isRequired,
  detail: PropTypes.shape().isRequired,
  data: PropTypes.shape().isRequired,
  type: PropTypes.string.isRequired,
  gotoRegion: PropTypes.func.isRequired,
  stopSpecific: PropTypes.func.isRequired,
  myPosition: PropTypes.shape(),
  startTrackingLocation: PropTypes.func.isRequired,
  stopTrackingLocation: PropTypes.func.isRequired,
  currentLocation: PropTypes.func,
  fetchingPosition: PropTypes.bool,
  onLayout: PropTypes.func,
};

ShareLocation.defaultProps = {
  myPosition: {},
  currentLocation: null,
  fetchingPosition: false,
  onLayout: () => {},
};

export default compose(withShareLocation)(ShareLocation);
