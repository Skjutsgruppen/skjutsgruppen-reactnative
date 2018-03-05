import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import Colors from '@theme/colors';
import Date from '@components/date';
import PropTypes from 'prop-types';
import ToolBar from '@components/utils/toolbar';

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
  username: {
    color: Colors.text.blue,
    fontWeight: 'bold',
    marginRight: 4,
  },
  text: {
    lineHeight: 22,
  },
  lightText: {
    color: Colors.text.darkGray,
  },
  date: {
    marginVertical: 12,
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
          <Text style={[styles.text, styles.lightText]}>
            <Text style={styles.username}>
              Your movement
            </Text>
          </Text>
          <Text style={[styles.date, styles.lightText]}><Date format="MMM DD HH:mm">{news.updatedAt}</Date></Text>
          <Text>{news.body}</Text>
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
