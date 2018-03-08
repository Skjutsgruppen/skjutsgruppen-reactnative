import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import TouchableHighlight from '@components/touchableHighlight';

const imageSize = 48;
const margin = 12;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    height: imageSize,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  titleWrapper: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    color: Colors.text.blue,
    marginHorizontal: 16,
    marginTop: 16,
  },
  bublesWrapper: {
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
  },
  profilePic: {
    width: imageSize,
    height: imageSize,
    resizeMode: 'cover',
    borderRadius: imageSize / 2,
    borderWidth: 4,
    borderColor: Colors.border.white,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  remainingCount: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    position: 'absolute',
    top: 0,
    backgroundColor: Colors.background.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.border.white,
  },
  count: {
    fontSize: 14,
    color: Colors.text.white,
  },
  loadingWrapper: {
    paddingVertical: 16,
    backgroundColor: Colors.background.fullWhite,
  },
});

const DetailedAvatar = ({ loading, rows, count, onPress, numberText }) => {
  if (loading) {
    return (<View style={styles.loadingWrapper}><Loading /></View>);
  }

  const { width } = Dimensions.get('window');
  const maxImage = parseInt(((width - 32) / 36), 0);
  let zIndex = maxImage;
  const membersToRender = rows.filter((member, index) => index <= maxImage - 1 && member);
  const warpperWidth = rows.length > maxImage ? 36 * maxImage : 36 * rows.length;

  if (count <= maxImage) {
    return (
      <View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{numberText}</Text>
        </View>
        <TouchableHighlight
          onPress={() => onPress()}
        >
          <View style={styles.bublesWrapper}>
            <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
              {
                membersToRender.map((member, index) => {
                  zIndex -= 1;

                  return (
                    <Image
                      source={{ uri: member.User.avatar }}
                      style={[
                        styles.profilePic,
                        index > 0 && { left: (index * imageSize) - (margin * index) },
                        { zIndex },
                      ]}
                      key={member.User.id}
                    />
                  );
                })
              }
            </View>
          </View>
        </TouchableHighlight>
      </View >
    );
  }

  return (
    <View>
      <TouchableHighlight
        onPress={() => onPress()}
      >
        <View>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>
              {numberText}
            </Text>
          </View>
          <View style={styles.bublesWrapper}>
            <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
              {
                membersToRender.map((member, index) => {
                  zIndex -= 1;
                  if (index < membersToRender.length - 1) {
                    return (
                      <Image
                        source={{ uri: member.User.avatar }}
                        style={[
                          styles.profilePic,
                          index > 0 && { left: (index * imageSize) - (margin * index) },
                          { zIndex },
                        ]}
                        key={member.id}
                      />
                    );
                  }

                  return (
                    <View
                      style={[
                        styles.remainingCount,
                        index > 0 && { left: (index * imageSize) - (margin * index) },
                        { zIndex },
                      ]}
                      key={member.User.id}
                    >
                      <Text style={styles.count}>
                        +{
                          (rows.length > maxImage)
                            ? (count - (maxImage - 1))
                            : (count - rows.length) + 1
                        }
                      </Text>
                    </View>
                  );
                })
              }
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};

DetailedAvatar.propTypes = {
  count: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      avatar: PropTypes.string,
    }).isRequired,
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  numberText: PropTypes.string.isRequired,
};

export default DetailedAvatar;
