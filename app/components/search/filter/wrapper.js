import React, { PureComponent, Children } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 13,
    marginBottom: 12,
    opacity: 0.5,
  },
});

class FiltersWrapper extends PureComponent {
  renderFilters() {
    return Children.map(this.props.children, child => child);
  }

  render() {
    const { style, title } = this.props;
    return (
      <View
        style={[styles.wrapper, style]}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.filters}>
          {this.renderFilters()}
        </View>
      </View>
    );
  }
}

FiltersWrapper.propTypes = {
  style: View.propTypes.style,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

FiltersWrapper.defaultProps = {
  style: {},
  title: '',
};

export default FiltersWrapper;

