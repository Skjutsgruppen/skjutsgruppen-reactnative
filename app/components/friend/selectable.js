import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import { Loading } from '@components/common';
import ShareItem from '@components/common/shareItem';
import Colors from '@theme/colors';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: '#1ca9e5',
    marginHorizontal: 24,
    marginBottom: 12,
  },
  head: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 24,
    marginTop: 16,
  },
  shareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  shareToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#999',
    marginLeft: 'auto',
  },
  shareToggleGray: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border.gray,
    backgroundColor: Colors.border.gray,
    marginLeft: 'auto',
  },
  shareToggleActive: {
    backgroundColor: '#a27ba8',
    borderColor: '#a27ba8',
  },
  checkIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  profilePic: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 12,
  },
});

const Selectable = ({ title, loading, rows, setOption, selected, disabled, user }) => {
  if (loading && rows === 0) return (<Loading />);

  if (rows.length === 0) return null;

  const hasOption = key => selected.indexOf(key) > -1;
  const hasDisabled = key => disabled.indexOf(key) > -1;
  return (
    <View>
      {
        title !== '' &&
        <View style={styles.head}>
          <Text style={styles.title}>{title.toUpperCase()}</Text>
        </View>
      }
      <ShareItem
        key={user.id}
        color={hasDisabled(user.id) ? '' : 'blue'}
        imageSource={user.avatar ? { uri: user.avatar } : require('@assets/icons/ic_user_default.png')}
        hasPhoto
        selected={hasOption(user.id)}
        label="You"
        onPress={() => { }}
      />
      {
        rows.filter(row => row.id !== user.id).map(row => (
          <ShareItem
            key={row.id}
            color={hasDisabled(row.id) ? 'gray' : 'blue'}
            imageSource={row.avatar ? { uri: row.avatar } : require('@assets/icons/ic_user_default.png')}
            hasPhoto
            selected={hasOption(row.id)}
            label={`${row.firstName} ${row.lastName}`}
            onPress={() => !hasDisabled(row.id) && setOption(row.id)}
          />
        ))
      }
    </View>
  );
};

Selectable.propTypes = {
  loading: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    firstName: PropTypes.string.isRequired,
  })).isRequired,
  title: PropTypes.string,
  setOption: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType(
    [PropTypes.arrayOf(PropTypes.number), PropTypes.arrayOf(PropTypes.string)],
  ).isRequired,
  disabled: PropTypes.arrayOf(PropTypes.number),
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

Selectable.defaultProps = {
  disabled: [],
  title: '',
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Selectable);
