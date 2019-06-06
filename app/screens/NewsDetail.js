import React from 'react';
import { StyleSheet, View, ScrollView, Image, Linking, Platform } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';
import { AutoHeightWebView } from '@components/common';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  imgWrapper: {
    height: 527,
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  detail: {
    flexDirection: 'column',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  seperator: {
    width: 84,
    backgroundColor: 'rgb(209, 208, 208)',
    height: 2,
    marginTop: 40,
    marginBottom: 20,
  },
  offsetText: {
    position: 'absolute',
    top: 30,
    right: 24,
    textShadowColor: Colors.text.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});


const NewsDetail = ({ navigation }) => {
  const { news } = navigation.state.params;
  let image = null;
  if (news.photo) {
    image = (<Image source={{ uri: news.photo }} style={styles.image} />);
  }
  let webview;
  const data = `<body style="font-size: 16; font-family: SFUIText-Regular"> ${news.body} <p><a href="http://www.twitter.com">Twitter test </a></p> </body>`;
  return (
    <View style={styles.wrapper}>
      <ToolBar transparent />
      <ScrollView>
        <View style={styles.imgWrapper} key="photo">
          {image}
          <AppText size={14} fontVariation="bold" style={styles.offsetText} color={Colors.text.white}>{trans('feed.news')}</AppText>
        </View>
        <View style={styles.detail}>
          <AppText color={Colors.text.darkGray}>
            <AppText color={Colors.text.black} size={32} fontVariation="bold" style={{ marginRight: 4, lineHeight: 44 }}>
              {news.title}
            </AppText>

          </AppText>
          <AutoHeightWebView
            // ref={(ref) => { webview = ref.webview; }}
            style={{ marginTop: 24 }}
            originWhitelist={['*']}
            onError={(error) => { console.warn(error); }}
            source={{ html: data }}
            openLink={(url) => { Linking.openURL(url); }}
            javaScriptEnabledAndroid
            javaScriptEnabled
            onNavigationStateChange={(event) => {
              console.log('onNavStateChanged ======== ', event);
              if (Platform.OS === 'ios') {
                if (event.navigationType !== 'click' || event.url === '') return;
                Linking.openURL(event.url.includes('http') ? event.url : `http://${event.url}`);
              } else if (webview && event.url.startsWith('http')) {
                webview.stopLoading();
                webview.goBack();
                Linking.openURL(event.url);
              }
            }}
          />
          {/* <AppText style={{ marginTop: 24, lineHeight: 24, color: '#424242' }} size={16}>{news.body}</AppText> */}
          <View style={styles.seperator} />
          <AppText color={Colors.text.darkGray} style={{ marginVertical: 12 }}><Date format="YYYY-MM-DD">{news.updatedAt}</Date></AppText>
        </View>
      </ScrollView>
    </View>
  );
};

NewsDetail.navigationOptions = {
  header: null,
};

NewsDetail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default NewsDetail;
