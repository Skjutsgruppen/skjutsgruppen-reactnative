import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import SunIcon from '@assets/icons/ic_camera_head.png';
import Arrow from '@assets/icons/ic_arrow_experience.png';
import { withNavigation } from 'react-navigation';
import { Loading } from '@components/common';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 30,
    marginTop: 30,
    marginBottom: 6,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: 24,
  },
  title: {
    fontSize: 18,
    color: Colors.text.gray,
  },
  horizontalScroller: {
    marginBottom: 24,
  },
  experience: {
    width: 250,
    margin: 16,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 60,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 12,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.15,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  sunIcon: {
    height: 22,
    width: 55,
    resizeMode: 'contain',
    marginBottom: 6,
    marginLeft: 12,
  },
  block: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  msg: {
    color: Colors.text.gray,
  },
  centered: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class List extends PureComponent {
  render() {
    const { experiences, navigation, title } = this.props;
    const { rows, loading, error } = experiences;
    let list = <Text style={[styles.block, styles.msg]}>No experiences has been created yet.</Text>;

    if (loading) {
      return (<View style={[styles.block, styles.centered]}><Loading /></View>);
    }

    if (error) {
      list = (
        <View style={styles.block}>
          <Text style={styles.msg}>{error.message}</Text>
          <TouchableHighlight
            onPress={() => experiences.refetch()}
            underlayColor={Colors.background.lightGray}
          >
            <Text style={styles.msg}>Retry</Text>
          </TouchableHighlight>
        </View>
      );
    }

    if (rows.length < 1) {
      return null;
    }

    list = rows.map(experience => (
      <TouchableHighlight
        underlayColor={Colors.background.lightGray}
        key={experience.id}
        onPress={() => navigation.navigate('ExperienceDetail', { experience })}
        style={styles.experience}
      >
        <Image source={{ uri: experience.photoUrl }} style={styles.image} />
      </TouchableHighlight>
    ));
    return (
      <View>
        <View style={styles.header}>
          <Image source={SunIcon} style={styles.sunIcon} />
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
            <Image source={Arrow} style={styles.arrow} />
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroller}
        >
          {list}
        </ScrollView>
      </View>
    );
  }
}

List.propTypes = {
  experiences: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    rows: PropTypes.isRequired,
    count: PropTypes.number.isRequired,
    fetchMore: PropTypes.func.isRequired,
    networkStatus: PropTypes.number.isRequired,
    error: PropTypes.object,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
};

List.defaultProps = {
  onComplete: () => { },
};

export default withNavigation(List);
