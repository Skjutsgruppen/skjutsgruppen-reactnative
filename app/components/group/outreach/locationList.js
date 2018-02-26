import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@components/common';
import { ViewPropTypes, Picker } from 'react-native';

const LocationList = ({ list, loading, style, selectedValue, onValueChange }) => {
  if (loading || list.length < 1) {
    return <Loading />;
  }

  return (<Picker
    style={style}
    selectedValue={selectedValue}
    onValueChange={onValueChange}
  >
    <Picker.Item
      label={'Select'}
      value={''}
    />
    {
      list.map(item => (<Picker.Item
        key={item.id}
        label={item.name}
        value={item.id}
      />))
    }
  </Picker>);
};

LocationList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  style: ViewPropTypes.style,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onValueChange: PropTypes.func.isRequired,
};


LocationList.defaultProps = {
  style: {},
  selectedValue: null,
};

export default LocationList;
