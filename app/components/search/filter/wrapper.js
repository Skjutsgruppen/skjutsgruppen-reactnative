import React, { PureComponent, Children } from 'react';
import { StyleSheet, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
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
        <AppText size={13} color={Colors.text.gray} style={{ marginBottom: 12 }}>{title}</AppText>
        <View style={styles.filters}>
          {this.renderFilters()}
        </View>
      </View>
    );
  }
}

FiltersWrapper.propTypes = {
  style: ViewPropTypes.style,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

FiltersWrapper.defaultProps = {
  style: {},
  title: '',
};

export default FiltersWrapper;

