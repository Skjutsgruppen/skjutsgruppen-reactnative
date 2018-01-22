import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import Curves from '@assets/curves.png';
import HRVLogo from '@assets/HRV_logo.png';

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
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 'bold',
    color: Colors.text.black,
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    lineHeight: 28,
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
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 28,
    color: Colors.text.black,
    marginBottom: 2,
  },
  hrvLogo: {
    width: '100%',
    resizeMode: 'contain',
    marginVertical: 32,
  },
});

const About = () => (
  <View style={styles.wrapper}>
    <Image source={Curves} style={styles.curves} />
    <Text style={styles.heading}>{trans('about.you_are_a_part_of_ride_sharing_movement')}</Text>
    <Text style={styles.text}>{trans('about.we_are_friends_of_friends')}</Text>
    <Text style={[styles.text, styles.bold]}>{trans('about.we_are_getting_closer_to_each_other')}</Text>
    <Text style={styles.text}>{trans('about.we_are_going_same_direction')}</Text>
    <Text style={styles.text}>
      {trans('about.we_share_the_costs_of_our_ride')}
      {trans('about.thank_you_for_being_a_part')}
    </Text>
    <View style={styles.horizontalDivider} />
    <View style={styles.infoRow}>
      <Image source={require('@assets/icons/ic_conversation.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{trans('about.we_believe_in_conversation')}</Text>
        <Text style={styles.text}>
          {trans('about.good_time_digitally')}
        </Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <Image source={require('@assets/icons/ic_caution.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{trans('about.be_health_cautious')}</Text>
        <Text style={styles.text}>{trans('about.rideshare_if_you_feel_safe')}</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <Image source={require('@assets/icons/ic_equal.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{trans('about.share_equally_or_offer_rides')}</Text>
        <Text style={styles.text}>
          {trans('about.in_sweden_the_cost_you_share')}
        </Text>
      </View>
    </View>
    <View style={[styles.infoRow, { marginBottom: 0 }]}>
      <Image source={require('@assets/profilePic.jpg')} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>{trans('about.you_are_awesome')}</Text>
        <Text style={styles.text}>
          {trans('about.the_movement_is_self_regulating')}
        </Text>
      </View>
    </View>
    <View style={styles.horizontalDivider} />
    <View styles={styles.HRV}>
      <Text style={styles.infoTitle}>{trans('about.we_made_this_together')}</Text>
      <Text style={styles.text}>
        {trans('about.the_movement_is_self_regulating')}
      </Text>
      <Image source={HRVLogo} style={styles.hrvLogo} />
    </View>
  </View>
);

export default About;
