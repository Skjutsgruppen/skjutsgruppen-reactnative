import React from 'react';
import { StyleSheet, View, ImageBackground, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { trans } from '@lang/i18n';
import { FEEDABLE_NEWS } from '@config/constant';
import { AppText, Heading } from '@components/utils/texts';
import TouchableHighlight from '@components/touchableHighlight';
import Footer from '@components/feed/card/newsFooter';

const cardHeight = 484;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  wrapper: {
    height: cardHeight,
    backgroundColor: Colors.background.fullWhite,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imgWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.background.gray,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  label: {
    margin: 20,
  },
  titleContainer: {
    paddingVertical: 16,
    marginHorizontal: 32,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: '100%',
    height: cardHeight / 2,
    resizeMode: 'cover',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
    shadowOffset: { width: 0, height: 2 },
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
  },
  blueBg: {
    backgroundColor: Colors.background.blue,
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
  text: {
    lineHeight: 20,
  },
});

// const News = ({ news, onPress, wrapperStyle, isStatic }) => {
//   const renderLinks = () => {
//     if (!news.links) return null;
//     let i = 0;
//     return news.links.map((link) => {
//       i += 1;
//       return (<AppText key={i}>{link}</AppText>);
//     });
//   };

//   let image = null;
//   if (news.photo) {
//     image = (<Image source={{ uri: news.photo }} style={styles.img} />);
//   }

//   return (
//     <View style={[styles.wrapper, wrapperStyle]}>
//       <TouchableWithoutFeedback
//         onPress={() => onPress(FEEDABLE_NEWS, news)}
//         style={styles.flex1}
//       >
//         <View style={styles.flex1}>
//           <View style={styles.imgWrapper}>
//             {image}
//           </View>
//           <View style={[styles.offerType, styles.blueBg]}>
//             <AppText size={10} color={Colors.text.white}>{trans('feed.your_movement').toUpperCase()}</AppText>
//           </View>
//           <View style={styles.detail}>
//             <View>
//               <AppText color={Colors.text.darkGray} style={styles.text}>
//                 <AppText color={Colors.text.blue} fontVariation="bold">
//                   {trans('feed.your_movement')}
//                 </AppText>
//               </AppText>
//               <AppText color={Colors.text.darkGray} style={styles.text}><Date format="MMM DD HH:mm">{news.updatedAt}</Date></AppText>
//             </View>
//           </View>
//           <View style={styles.comment}>
//             <AppText style={styles.text}>{news.body}</AppText>
//             {renderLinks()}
//             <View style={styles.commentGradientOverlay} />
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </View>
//   );
// };

const News = ({ news, onPress }) => (
  <View style={styles.wrapper}>
    <View style={styles.imgWrapper}>
      <ImageBackground
        source={{ uri: news.photo }}
        style={{ width: '100%', height: cardHeight, borderRadius: 12 }}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <TouchableHighlight
            onPress={() => onPress(FEEDABLE_NEWS, news)}
            style={styles.flex1}
          >
            <View style={styles.flex1}>
              <AppText color={Colors.text.white} style={styles.label}>{trans('feed.news')}</AppText>
              <View style={styles.titleContainer}>
                <Heading size={48} color={Colors.text.white} centered>{news.title}</Heading>
              </View>
            </View>
          </TouchableHighlight>
          {/* <Footer
            onSharePress={() => {}}
            onCommentPress={() => {}}
            totalFeeds={10}
          /> */}
        </View>
      </ImageBackground>
    </View>
  </View>
);

News.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

News.defaultProps = {
  title: '',
};

export default News;
