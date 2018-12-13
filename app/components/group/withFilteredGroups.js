import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class WithFilteredGroups extends PureComponent {
  componentWillMount() {
    const { user, subscribeToNewGroup } = this.props;

    if (user.id) {
      subscribeToNewGroup({ userId: user.id });
    }
  }

  render() {
    const { groups } = this.props;

    if (groups.count < 1) return null;

    return this.props.render(groups.rows);
  }
}

WithFilteredGroups.propTypes = {
  groups: PropTypes.shape({
    count: PropTypes.number.isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  subscribeToNewGroup: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(WithFilteredGroups);
