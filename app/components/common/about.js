import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Colors from '@theme/colors';

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
    <Text style={styles.heading}>You are part of the ridesharing movement.</Text>
    <Text style={styles.text}>We are friends and friends of friends of friends.</Text>
    <Text style={[styles.text, styles.bold]}>We’re getting closer to each other.</Text>
    <Text style={styles.text}>
      When we’re going the same direction we offer our spare seats
      to each other in buses, boats, cars, bicycles and hot air balloons.
    </Text>
    <Text style={styles.text}>
      We share the costs of our rides equally or offer rides for free,
      because friends don’t make money of friends.
      Thank you for being a part of this Insert_First_Name!
    </Text>
    <View style={styles.horizontalDivider} />
    <View style={styles.infoRow}>
      <Image source={require('@icons/ic_conversation.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>We believe in conversation</Text>
        <Text style={styles.text}>
          Thanks to you we have a good time both here digitally and in the vehicle.
        </Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <Image source={require('@icons/ic_caution.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>Be healthy cautious</Text>
        <Text style={styles.text}>Rideshare if you feel safe.</Text>
      </View>
    </View>
    <View style={styles.infoRow}>
      <Image source={require('@icons/ic_equal.png')} style={styles.infoRowIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>Share equally or offer rides for free</Text>
        <Text style={styles.text}>
          In Sweden the cost you share is up to 18,50 SEK per 10 kilometers (km)
            for cars. 18,50 SEK is close to 2 € or 2 $. In our movement the costs
            you share can not be more then that (see the Participant Agreement).
            For other vehicles there is no set cost per km as long as you don’t make profit.
            Help each other in the comments to calculate kilometers
            and costs before the ride. Read more about costs
        </Text>
      </View>
    </View>
    <View style={[styles.infoRow, { marginBottom: 0 }]}>
      <Image source={require('@assets/profilePic.jpg')} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.infoTitle}>You are awesome</Text>
        <Text style={styles.text}>
          The movement is self-regulating, since we’re all the movement together.
          No “leader” is in charge over your conversation. You’re in charge.
          Comment as much as you like as long as you keep to the Participant agreement.
        </Text>
      </View>
    </View>
    <View style={styles.horizontalDivider} />
    <View styles={styles.HRV}>
      <Text style={styles.infoTitle}>We made this together!</Text>
      <Text style={styles.text}>
        The movement is self-regulating, since we’re all the movement together.
        No “leader” is in charge over your conversation. You’re in charge.
        Comment as much as you like as long as you keep to the Participant agreement.
      </Text>
      <Image source={HRVLogo} style={styles.hrvLogo} />
    </View>
  </View>
);

export default About;
