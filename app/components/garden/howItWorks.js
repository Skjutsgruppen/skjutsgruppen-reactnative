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
import { trans } from '@lang/i18n';

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
    >{trans('profile.this_is_how_it_works')}</Title>
    <Heading size={26} color={Colors.text.pink} style={{ lineHeight: 36 }}>
      {trans('profile.everything_is_transparent')}
    </Heading>
    <View style={styles.row}>
      <View style={styles.iconWrapper}>
        <Image source={WateringCan} />
      </View>
      <AppText style={styles.text}>
        {trans('profile.all_the_costs_are_transparent')}
      </AppText>
    </View>
    <View style={styles.row}>
      <View style={styles.iconWrapper}>
        <Avatar size={62} isSupporter={user.isSupporter} imageURI={user.avatar} />
      </View>
      <AppText style={styles.text}>
        {trans('profile.all_the_costs_are_transparent')}
      </AppText>
    </View>
    <View style={styles.row}>
      <View style={styles.iconWrapper}>
        <Image source={AddPhoto} style={{ resizeMode: 'contain' }} />
      </View>
      <AppText style={styles.text}>
        {trans('profile.all_the_costs_are_transparent')}
      </AppText>
    </View>
    <AppText style={{ lineHeight: 26, marginTop: 48 }}>
      {trans('profile.your_support_is_payed_via')}
    </AppText>
  </View>
);

HowItWorks.propTypes = {
  user: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(connect(mapStateToProps))(HowItWorks);
