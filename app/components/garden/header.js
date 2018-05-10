import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Title, Heading } from '@components/utils/texts';
import Colors from '@theme/colors';
import Avatar from '@components/common/avatar';
import Curves from '@assets/curves_green.png';

const styles = StyleSheet.create({
  curves: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  content: {
    padding: 30,
    paddingTop: 50,
  },
  heading: {
    maxWidth: 220,
    lineHeight: 36,
    marginBottom: 24,
  },
  miniDivider: {
    height: 1,
    width: 64,
    backgroundColor: Colors.text.lightGray,
    marginTop: 24,
    marginBottom: 32,
  },
});

const Header = ({ showTitle, showAvatar, headingLabel, infoLabel, user }) => (
  <View style={styles.wrapper}>
    <Image source={Curves} style={styles.curves} />
    <View style={styles.content}>
      {
        showTitle && <Title size={15} color={Colors.text.blue} style={{ marginVertical: 16 }}>{'TOGETHER'.toLocaleUpperCase()}</Title>
      }
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading
          size={32}
          color={Colors.text.pink}
          fontVariation="bold"
          style={[styles.heading, { flex: 1 }]}
        >{headingLabel}</Heading>
        {
          showAvatar &&
            <Avatar isSupporter size={120} imageURI={user.avatar} />
        }
      </View>
      <View style={styles.miniDivider} />
      {
        infoLabel !== '' && infoLabel && (
          <Title size={23} color={Colors.text.gray} style={{ lineHeight: 36 }}>
            {infoLabel}
          </Title>
        )
      }
    </View>
  </View>
);

Header.propTypes = {
  showAvatar: PropTypes.bool.isRequired,
  showTitle: PropTypes.bool.isRequired,
  headingLabel: PropTypes.string.isRequired,
  infoLabel: PropTypes.string,
  user: PropTypes.shape().isRequired,
};

Header.defaultProps = {
  infoLabel: null,
};


export default Header;
