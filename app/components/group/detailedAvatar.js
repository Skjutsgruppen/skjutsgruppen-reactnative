import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import TouchableHighlight from '@components/touchableHighlight';
import { AppText } from '@components/utils/texts';
import Avatar from '@components/common/avatar';

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
    marginHorizontal: 16,
    marginTop: 16,
  },
  bublesWrapper: {
    justifyContent: 'center',
    backgroundColor: Colors.background.fullWhite,
  },
  profilePicWrapper: {
    width: imageSize,
    height: imageSize,
    borderRadius: imageSize / 2,
    borderWidth: 4,
    borderColor: Colors.border.white,
    backgroundColor: Colors.background.lightGray,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
          {numberText.length > 0 && (
            <AppText size={12} color={Colors.text.blue} style={styles.title}>{numberText}</AppText>
          )}
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
                    <View
                      style={[
                        styles.profilePicWrapper,
                        index > 0 && { left: (index * imageSize) - (margin * index) },
                        { zIndex },
                      ]}
                      key={member.User.id}
                    >
                      <Avatar
                        imageURI={member.User.avatar}
                        isSupporter={member.User.isSupporter}
                        size={40}
                        onPress={() => onPress()}
                      />
                    </View>
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
            {numberText.length > 0 && <AppText style={styles.title}>{numberText}</AppText>}
          </View>
          <View style={styles.bublesWrapper}>
            <View style={[styles.wrapper, { width: warpperWidth + 12 }]}>
              {
                membersToRender.map((member, index) => {
                  zIndex -= 1;
                  if (index < membersToRender.length - 1) {
                    return (
                      <View
                        style={[
                          styles.profilePicWrapper,
                          index > 0 && { left: (index * imageSize) - (margin * index) },
                          { zIndex },
                        ]}
                        key={member.id}
                      >
                        <Avatar
                          imageURI={member.User.avatar}
                          isSupporter={member.User.isSupporter}
                          size={40}
                          onPress={() => onPress()}
                        />
                      </View>
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
                      <AppText size={12} color={Colors.text.white} allowFontScaling={false}>
                        +{
                          (rows.length > maxImage)
                            ? (count - (maxImage - 1))
                            : (count - rows.length) + 1
                        }
                      </AppText>
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
