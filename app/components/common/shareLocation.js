import React, { PureComponent } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, Modal, Alert } from 'react-native';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
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
import { withNavigation } from 'react-navigation';

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
      shareLocationLoading: false,
    });
  }

  componentWillMount() {
    const { data } = this.props.locationSharedToSpecificResource;
    const { detail, myPosition, pressShareLocation, currentLocation } = this.props;
    const { __typename } = detail;

    if (pressShareLocation) currentLocation();

    this.setState({
      sharedLocations: data,
      myLocation: detail.Location,
      myPosition,
      showActionOption: pressShareLocation,
    });

    // this.loadInterval = setInterval(() => {
    //   updateSharedLocation(detail.id, __typename);
    // }, 60000);
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

    this.setState({ showActionOption: false, shareLocationLoading: true });

    const obj = {
      point: [myPosition.longitude, myPosition.latitude],
      duration: unit,
      users: [],
    };

    if (__typename === 'Group') {
      obj.groupId = detail.id;
      startTrackingLocation();
      shareLocation(obj)
        .then(() => this.setState({ shareLocationLoading: false }))
        .catch(() => this.setState({ shareLocationLoading: false }));
    }
    if (__typename === 'Trip') {
      obj.tripId = detail.id;
      this.setState({ location: obj, showShareModal: true });
      // startTrackingLocation();
      // shareLocation(obj)
      //   .then(() => this.setState({ shareLocationLoading: false }))
      //   .catch(() => this.setState({ shareLocationLoading: false }));
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
    const { detail, navigation } = this.props;

    return (
      <View>
        <TouchableHighlight onPress={() => navigation.navigate('TripDetail', { id: detail.id })}>
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
        </TouchableHighlight>
        <View style={styles.horizontalDivider} />
      </View>
    );
  }

  group = () => {
    const { detail: { id, name }, navigation } = this.props;

    return (
      <TouchableHighlight onPress={() => navigation.navigate('GroupDetail', { id })}>
        <View style={styles.groupName}>
          <Text style={TextStyles.bold}>{name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  showActionModal = () => {
    const { showActionOption, myLocation } = this.state;
    const { fetchingPosition, myPosition } = this.props;

    if (!showActionOption ||
      fetchingPosition ||
      !myPosition.longitude ||
      !myPosition.latitude ||
      (myLocation && myLocation.id)
    ) return null;

    return (
      <ActionModal
        title={`${trans('global.share_live_location_for')}:`}
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
        onRequestClose={() => this.setState({ showShareModal: false, shareLocationLoading: false })}
        animationType="slide"
      >
        <Share
          modal={false}
          type={FEEDABLE_LOCATION}
          detail={detail}
          location={location}
          startTrackingLocation={startTrackingLocation}
          onClose={() => this.setState({ showShareModal: false, shareLocationLoading: false })}
          buttonText={trans('global.share_location_for')}
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
    const { myLocation, shareLocationLoading } = this.state;
    const { __typename } = detail;

    return (
      <TouchableHighlight
        onPress={() => {
          if (fetchingPosition) return;
          if (myLocation.id) {
            stopTrackingLocation();
            stopSpecific({ id: detail.id, type: __typename })
              .then(() => this.setState({ myLocation: {}, fetchingPosition: false }))
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
          {shareLocationLoading && <Loading />}
          {!shareLocationLoading &&
            <View style={{ flex: 1 }}>
              {!myLocation.id && !fetchingPosition &&
                <View>
                  <Text style={TextStyles.blue}>{trans('global.share_my_live_location_for')}</Text>
                  <Text style={TextStyles.light}>{trans('global.choose_with_who_and_for_how_long_you_share')}</Text>
                </View>
              }
              {!myLocation.id && fetchingPosition &&
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={TextStyles.light}>{trans('global.fetching_your_location')}</Text><Loading />
                </View>
              }
              {myLocation.id && myLocation.duration > 0 &&
                <View style={[styles.row, { flex: 1, justifyContent: 'space-between' }]}>
                  <View>
                    <Text style={TextStyles.blue}>{trans('global.stop_sharing_location')}</Text>
                    <Text style={TextStyles.light}>{trans('global.in_this')} {__typename}</Text>
                  </View>
                  <Timer timeFraction={myLocation.timeFraction} duration={myLocation.duration} />
                </View>
              }
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
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
  pressShareLocation: PropTypes.bool,
};

ShareLocation.defaultProps = {
  pressShareLocation: false,
  myPosition: {},
  currentLocation: null,
  fetchingPosition: false,
  onLayout: () => { },
};

export default compose(withShareLocation, withNavigation)(ShareLocation);
