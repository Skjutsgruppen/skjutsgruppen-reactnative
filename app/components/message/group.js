import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import Colors from '@theme/colors';
import { Loading } from '@components/common';
import { withGroups } from '@services/apollo/auth';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  lightText: {
    color: Colors.text.gray,
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 16,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  profilePicWrapper: {
    flexDirection: 'row',
    marginRight: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: 4,
  },
  chevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  emptyMessage: {
    opacity: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  spacedWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
});

const renderPic = (photo) => {
  let profileImage = null;

  if (photo) {
    profileImage = (<Image source={{ uri: photo }} style={styles.profilePic} />);
  }

  return profileImage;
};

const item = (group, navigation) => (
  <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { group })} key={group.id}>
    <View style={styles.list}>
      <View style={styles.flexRow}>
        <View style={styles.profilePicWrapper}>
          {group.photo ? renderPic(group.photo) : renderPic(group.mapPhoto)}
        </View>
        <View>
          <Text>{group.name}</Text>
        </View>
      </View>
      <View>
        <Image
          source={require('@assets/icons/icon_chevron_right.png')}
          style={styles.chevron}
        />
      </View>
    </View>
  </TouchableOpacity>
);


const Group = ({ groups, navigation }) => {
  let render = (<Text style={styles.emptyMessage}>No Group</Text>);

  if (groups.count > 0) {
    render = groups.rows.map(group => item(group, navigation));
  }

  if (groups.error) {
    render = (
      <View style={{ marginTop: 100 }}>
        <Text>Error: {groups.error.message}</Text>
        <TouchableOpacity onPress={() => groups.refetch()}>
          <Text>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (groups.loading) {
    render = (
      <View style={styles.spacedWrapper}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {('Your groups'.toUpperCase())}
      </Text>
      {render}
    </View>
  );
};

Group.propTypes = {
  groups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default withGroups(Group);
