import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import Curves from '@assets/curves.png';
import HRVLogo from '@assets/HRV_logo.png';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { AppText, Heading } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    padding: 30,
    backgroundColor: Colors.background.mutedBlue,
    marginTop: 32,
  },
  curves: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  heading: {
    maxWidth: 264,
    lineHeight: 30,
    marginBottom: 24,
  },
  text: {
    fontSize: 14,
    lineHeight: 24,
  },
  bold: {
    fontWeight: 'bold',
  },
  horizontalDivider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.gray,
    marginVertical: 40,
    opacity: 0.25,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  infoRowIcon: {
    marginRight: 32,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 32,
  },
  infoTitle: {
    lineHeight: 20,
    marginBottom: 2,
  },
  hrvLogo: {
    width: '100%',
    resizeMode: 'contain',
    marginVertical: 32,
  },
});

const About = ({ user }) => (
  <View style={styles.wrapper}>
    <Image source={Curves} style={styles.curves} />
    <Heading fontVariation="bold" style={styles.heading}>{trans('about.you_are_a_part_of_ride_sharing_movement')}</Heading>
    <AppText style={styles.text}>{trans('about.we_are_friends_of_friends')}</AppText>
    <AppText style={[styles.text, styles.bold]}>{trans('about.we_are_getting_closer_to_each_other')}</AppText>
    <AppText style={styles.text}>{trans('about.we_are_going_same_direction')}</AppText>
    <AppText style={styles.text}>
      {trans('about.we_share_the_costs_of_our_ride')}
      {trans('about.thank_you_for_being_a_part')} {user.firstName}!
    </AppText>
    <View style={styles.horizontalDivider} />
    <View style={styles.infoRow}>
      <Image source={require('@assets/icons/ic_conversation.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Heading fontVariation="bold" size={16} style={styles.infoTitle}>{trans('about.we_believe_in_conversation')}</Heading>
        <AppText style={styles.text}>
          {trans('about.good_time_digitally')}
        </AppText>
      </View>
    </View>
    <View style={styles.infoRow}>
      <Image source={require('@assets/icons/ic_caution.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Heading fontVariation="bold" size={16} style={styles.infoTitle}>{trans('about.be_health_cautious')}</Heading>
        <AppText style={styles.text}>{trans('about.rideshare_if_you_feel_safe')}</AppText>
      </View>
    </View>
    <View style={styles.infoRow}>
      <Image source={require('@assets/icons/ic_equal.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Heading fontVariation="bold" size={16} style={styles.infoTitle}>{trans('about.share_equally_or_offer_rides')}</Heading>
        <AppText style={styles.text}>
          {trans('about.in_sweden_the_cost_you_share')}
        </AppText>
      </View>
    </View>
    <View style={[styles.infoRow, { marginBottom: 0 }]}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Heading fontVariation="bold" size={16} style={styles.infoTitle}>{trans('about.you_are_awesome')}</Heading>
        <AppText style={styles.text}>
          {trans('about.the_movement_is_self_regulating')}
        </AppText>
      </View>
    </View>
    <View style={styles.horizontalDivider} />
    <View styles={styles.HRV}>
      <Heading fontVariation="bold" size={16} style={styles.infoTitle}>{trans('about.we_made_this_together')}</Heading>
      <AppText style={styles.text}>
        {trans('about.this_app_is_enabled')}
      </AppText>
      <Image source={HRVLogo} style={styles.hrvLogo} />
    </View>
  </View>
);

About.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(About);
