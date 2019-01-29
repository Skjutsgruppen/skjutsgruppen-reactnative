import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import ActiveGroupItem from '@components/message/ActiveGroupItem';

const styles = StyleSheet.create({
  section: {
    paddingTop: 16,
  },
  sectionTitle: {
    marginHorizontal: 24,
  },
});

class AllGroup extends PureComponent {
  componentWillMount() {
    const { user, subscribeToNewGroup } = this.props;

    if (user.id) {
      subscribeToNewGroup({ userId: user.id });
    }
  }

  render() {
    const { groups } = this.props;

    if (groups.count < 1) return null;

    return (
      <View style={styles.section}>
        {
          groups.rows.map(item => (item.isBlocked ?
            null :
            <ActiveGroupItem key={item.id} group={item} />))
        }
      </View>
    );
  }
}

AllGroup.propTypes = {
  groups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToNewGroup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(withNavigation, connect(mapStateToProps))(AllGroup);
