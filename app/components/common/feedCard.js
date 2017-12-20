import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import Colors from '@theme/colors';

const cardHeight = 484;
const profilePicSize = 60;

const styles = StyleSheet.create({
  wrapper: {
    height: cardHeight,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOpacity: 1.0,
    shadowRadius: 2,
  },
  imgWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  groupName: {
    backgroundColor: 'transparent',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
    alignSelf: 'center',
  },
  profilePic: {
    height: profilePicSize,
    width: profilePicSize,
    resizeMode: 'cover',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border.white,
    position: 'absolute',
    top: (cardHeight / 2) - (profilePicSize / 2),
    right: 20,
    zIndex: 10,
  },
  offerType: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
  },
  pinkBg: {
    backgroundColor: Colors.background.pink,
  },
  orangeBg: {
    backgroundColor: Colors.background.orange,
  },
  typeText: {
    color: Colors.text.white,
    fontSize: 10,
  },
  detail: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  comment: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 'auto',
    overflow: 'hidden',
  },
  commentGradientOverlay: {
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.85)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 24,
  },
  footer: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCout: {
    color: '#888',
    marginRight: 10,
  },
  text: {
    lineHeight: 20,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  username: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
  readMore: {
    color: Colors.text.blue,
    fontWeight: 'bold',
  },
});

class FeedCard extends Component {
  state = {
    fadeInUpAnim: new Animated.Value(0),
  }

  componentDidMount() {
    Animated.spring(this.state.fadeInUpAnim, { toValue: 1 }).start();
  }
  render() {
    const animStyle = {
      opacity: this.state.fadeInUpAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: this.state.fadeInUpAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          }),
        },
        {
          scale: this.state.fadeInUpAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      ],
    };

    return (
      <View>
        <View style={styles.wrapper}>
          <View style={styles.imgWrapper}>
            <Image source={require('@assets/feed-img.jpg')} style={styles.img} />
          </View>
          <Animated.View style={[styles.offerType, styles.blueBg, animStyle]}>
            <Text style={styles.typeText}>{('asking a ride').toUpperCase()}</Text>
          </Animated.View>
          <Animated.Image source={require('@assets/profilePic.jpg')} style={[styles.profilePic, animStyle]} />
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username} onPress={() => Alert.alert('this is alert')}>Lovisa </Text>
                offers 1 seat
              </Text>
              <Text style={[styles.text, styles.lightText]}>Stockholm - Malmo</Text>
              <Text style={[styles.text, styles.lightText]}>Oct 20, 09.00</Text>
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={styles.text}>
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
            </Text>
            <View style={styles.commentGradientOverlay} />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity>
              <Image source={require('@icons/ic_share.png')} />
            </TouchableOpacity>
            <View style={styles.commentIcon}>
              <Text style={styles.commentCout}>77</Text>
              <TouchableOpacity>
                <Image source={require('@icons/ic_comment.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.imgWrapper}>
            <Image source={require('@assets/feed-img.jpg')} style={styles.img} />
          </View>
          <View style={[styles.offerType, styles.pinkBg]}>
            <Text style={styles.typeText}>{('offering a ride').toUpperCase()}</Text>
          </View>
          <Image source={require('@assets/profilePic.jpg')} style={styles.profilePic} />
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username} onPress={() => Alert.alert('this is alert')}>Lovisa </Text>
                offers 1 seat
              </Text>
              <Text style={[styles.text, styles.lightText]}>Stockholm - Malmo</Text>
              <Text style={[styles.text, styles.lightText]}>Oct 20, 09.00</Text>
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={styles.text}>
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
            </Text>
            <View style={styles.commentGradientOverlay} />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity>
              <Image source={require('@icons/ic_share.png')} />
            </TouchableOpacity>
            <View style={styles.commentIcon}>
              <Text style={styles.commentCout}>77</Text>
              <TouchableOpacity>
                <Image source={require('@icons/ic_comment.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.imgWrapper}>
            <Image source={require('@assets/feed-img.jpg')} style={styles.img} />
          </View>
          <View style={[styles.offerType, styles.orangeBg]}>
            <Text style={styles.typeText}>{('Experience').toUpperCase()}</Text>
          </View>
          <Image source={require('@assets/profilePic.jpg')} style={styles.profilePic} />
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username} onPress={() => Alert.alert('this is alert')}>Lovisa </Text>
                offers 1 seat
              </Text>
              <Text style={[styles.text, styles.lightText]}>Stockholm - Malmo</Text>
              <Text style={[styles.text, styles.lightText]}>Oct 20, 09.00</Text>
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={styles.text}>
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
            </Text>
            <View style={styles.commentGradientOverlay} />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity>
              <Image source={require('@icons/ic_share.png')} />
            </TouchableOpacity>
            <View style={styles.commentIcon}>
              <Text style={styles.commentCout}>77</Text>
              <TouchableOpacity>
                <Image source={require('@icons/ic_comment.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.imgWrapper}>
            <Image source={require('@assets/feed-img.jpg')} style={styles.img} />
            <Text style={styles.groupName}>Daily commute to town</Text>
          </View>
          <Image source={require('@assets/profilePic.jpg')} style={styles.profilePic} />
          <View style={styles.detail}>
            <View>
              <Text style={[styles.text, styles.lightText]}>
                <Text style={styles.username} onPress={() => Alert.alert('this is alert')}>Lovisa </Text>
                offers 1 seat
              </Text>
              <Text style={[styles.text, styles.lightText]}>Stockholm - Malmo</Text>
              <Text style={[styles.text, styles.lightText]}>Oct 20, 09.00</Text>
            </View>
          </View>
          <View style={styles.comment}>
            <Text style={styles.text}>
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
              Hi I’m going down to Malmö with a
              couple of friends. We have one seat left
              in our car if you would like to join. If you
            </Text>
            <View style={styles.commentGradientOverlay} />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity>
              <Image source={require('@icons/ic_share.png')} />
            </TouchableOpacity>
            <View style={styles.commentIcon}>
              <TouchableOpacity>
                <Text style={styles.readMore}>Read more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default FeedCard;
