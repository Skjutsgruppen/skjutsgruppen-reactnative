import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  imgWrapper: {
    height: 224,
    backgroundColor: '#e0e0e0',
  },
  detail: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});


const NewsDetail = ({ navigation }) => {
  const { news } = navigation.state.params;
  let image = null;
  if (news.photo) {
    image = (<Image source={{ uri: news.photo }} style={styles.image} />);
  }

  return (
    <View style={styles.wrapper}>
      <ToolBar transparent />
      <ScrollView>
        <View style={styles.imgWrapper} key="photo">
          {image}
        </View>
        <View style={styles.detail}>
          <AppText color={Colors.text.darkGray}>
            <AppText color={Colors.text.blue} fontVariation="bold" style={{ marginRight: 4 }}>
              {trans('global.your_movement')}
            </AppText>
          </AppText>
          <AppText color={Colors.text.darkGray} style={{ marginVertical: 12 }}><Date format="MMM DD HH:mm">{news.updatedAt}</Date></AppText>
          <AppText>{news.body}</AppText>
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
