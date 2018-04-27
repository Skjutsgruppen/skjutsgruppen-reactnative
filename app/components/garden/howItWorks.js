import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

import { AppText, Title, Heading } from '@components/utils/texts';
import Colors from '@theme/colors';
import Avatar from '@components/common/avatar';
import WateringCan from '@assets/icons/ic_watering_can.png';
import AddPhoto from '@assets/icons/ic_add_photo.png';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.background.mutedBlue,
    elevation: 23,
    paddingVertical: 40,
    paddingHorizontal: 30,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  iconWrapper: {
    minWidth: 64,
  },
  text: {
    flex: 1,
    marginLeft: 32,
  },
});

const HowItWorks = ({ user }) => (
  <View style={styles.wrapper}>
    <Title
      size={15}
      color={Colors.text.blue}
      style={{ marginBottom: 16 }}
    >THIS IS HOW IT WORKS</Title>
    <Heading size={26} color={Colors.text.pink} style={{ lineHeight: 36 }}>
      Everything is transparent
    </Heading>
    <View style={styles.row}>
      <View style={styles.iconWrapper}>
        <Image source={WateringCan} />
      </View>
      <AppText style={styles.text}>
        All the costs are transparent.(scroll down to see them)
      </AppText>
    </View>
    <View style={styles.row}>
      <View style={styles.iconWrapper}>
        <Avatar size={62} isSupporter imageURI={user.avatar} />
      </View>
      <AppText style={styles.text}>
        All the costs are transparent.(scroll down to see them)
      </AppText>
    </View>
    <View style={styles.row}>
      <View style={styles.iconWrapper}>
        <Image source={AddPhoto} style={{ resizeMode: 'contain' }} />
      </View>
      <AppText style={styles.text}>
        All the costs are transparent.(scroll down to see them)
      </AppText>
    </View>
    <AppText style={{ lineHeight: 26, marginTop: 48 }}>
      Your support is payed with your iTunes account or Google Play depending
      on your device. If you like to continue to support the movement you
      don’t have to do anything, your support will be auto-renewed.
      You can turn of auto-renewal by going to your settings
      in the iTunes store or Google Play.
    </AppText>
  </View>
);

HowItWorks.propTypes = {
  user: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(connect(mapStateToProps))(HowItWorks);
