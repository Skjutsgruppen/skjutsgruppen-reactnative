import React from 'react';
import { StyleSheet, View, ScrollView, Image, Linking, Platform, Animated } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import PropTypes from 'prop-types';
import TripToolBar from '@components/utils/tripToolBar';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';
import { AutoHeightWebView, Wrapper } from '@components/common';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  imgWrapper: {
    height: 500,
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  detail: {
    backgroundColor: 'white',
    flexDirection: 'column',
    paddingHorizontal: 24,
    marginTop: 34,
  },
  seperator: {
    width: 84,
    backgroundColor: '#e8e7e7',
    height: 1,
    marginTop: 20,
    marginBottom: 6,
  },
  offsetText: {
    position: 'absolute',
    top: 30,
    right: 24,
  },
});


class NewsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.opacityValue = new Animated.Value(1);
  }
  componentWillMount() {
    const { navigation } = this.props;
    navigation.setParams({ animatedValue: this.animatedValue, opacityValue: this.opacityValue });
  }
  render() {
    const { navigation } = this.props;
    const { news } = navigation.state.params;
    let image = null;
    if (news.photo) {
      image = (<Image source={{ uri: news.photo }} style={styles.image} />);
    }
    let webview;
    const data = `<html><style>a{color:#00aeef;font-weight: bold; text-decoration:none}</style><body style="font-size: 17; line-height: 26px; color: #212121; font-family: SFUIText-Regular"> ${news.body}</body></html>`;
    return (
      <Wrapper>
        <TripToolBar transparent />
        <ScrollView
          scrollEventThrottle={16}
          style={{ backgroundColor: Colors.background.fullWhite }}
          onScroll={(event) => {
            if (this.animatedValue._value > event.nativeEvent.contentOffset.y) {
              this.opacityValue.setValue(1);
            } else {
              this.opacityValue.setValue(0);
            }
            if (event.nativeEvent.contentOffset.y < 120) {
              this.opacityValue.setValue(0);
            }
            if (event.nativeEvent.contentOffset.y === 0) {
              this.opacityValue.setValue(1);
            }
            this.animatedValue.setValue(event.nativeEvent.contentOffset.y);
          }}
        >
          <View style={styles.imgWrapper} key="photo">
            {image}
            <AppText size={14} fontVariation="bold" style={styles.offsetText} color={Colors.text.white}>{trans('feed.news').toUpperCase()}</AppText>
          </View>
          <View style={styles.detail}>
            <AppText color={Colors.text.darkGray}>
              <AppText color={Colors.text.black} size={32} fontVariation="bold" style={{ lineHeight: 44 }}>
                {news.title}
              </AppText>

            </AppText>
            <AutoHeightWebView
              ref={(ref) => {
                if (this.webview) return;
                this.webview = ref.webview;
              }}
              style={{ marginTop: 4, marginLeft: -8 }}
              originWhitelist={['*']}
              onError={(error) => { console.warn(error); }}
              source={{ html: data }}
              openLink={(url) => { Linking.openURL(url); }}
              javaScriptEnabledAndroid
              javaScriptEnabled
              onNavigationStateChange={(event) => {
                if (Platform.OS === 'ios') {
                  if (event.navigationType !== 'click' || event.url === '') return;
                  if (this.webview) {
                    this.webview.stopLoading();
                    this.webview.goBack();
                    Linking.openURL(event.url.includes('http') ? event.url : `http://${event.url}`);
                  }
                } else if (this.webview && event.url.startsWith('http')) {
                  webview.stopLoading();
                  webview.goBack();
                  Linking.openURL(event.url);
                }
              }}
            />
            {/* <AppText style={{ marginTop: 24, lineHeight: 24, color: '#424242' }} size={16}>{news.body}</AppText> */}
            <View style={styles.seperator} />
            <AppText size={14} color={Colors.text.black} style={{ marginVertical: 12, marginBottom: 56 }}><Date format="YYYY-MM-DD">{news.updatedAt}</Date></AppText>
          </View>
        </ScrollView>

      </Wrapper>
    );
  }
}

NewsDetail.navigationOptions = {
  header: null,
};

NewsDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default NewsDetail;
