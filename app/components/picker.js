import React, { PureComponent } from 'react';
import { View, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Colors from '@theme/colors';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  wrapper: {
    height: 48,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  customPicker: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  pickerContent: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 2,
    paddingVertical: 12,
  },
  pickerItem: {
    height: 40,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  textWrapper: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  selected: {
    backgroundColor: '#eee',
  },
});

class Picker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = ({ selected: '', modalVisibility: false, list: [] });
  }

  componentWillMount() {
    const { list, defaultValue } = this.props;
    this.setState({ list, selected: defaultValue });
  }

  onSelect = (key) => {
    this.setState({ selected: key });
    this.props.onChange(key);
    this.hideModal();
  }

  getScrollIndex = () => {
    let selectedIndex = 0;

    this.state.list.forEach((row, index) => {
      if (row.key === this.state.selected) {
        selectedIndex = index;
      }
    });

    return selectedIndex;
  }

  getItemLayout = (data, index) => ({ length: 40, offset: 40 * index, index })

  showModal = () => this.setState({ modalVisibility: true });

  hideModal = () => this.setState({ modalVisibility: false });

  modal() {
    return (
      <Modal
        transparent
        onRequestClose={this.hideModal}
        visible={this.state.modalVisibility}
      >
        <View style={styles.customPicker}>
          <View style={styles.pickerContent}>
            {this.renderlist()}
          </View>
        </View>
      </Modal>
    );
  }


  renderlist = () => (
    <FlatList
      ref={(ref) => { this.flatListRef = ref; }}
      getItemLayout={this.getItemLayout}
      initialScrollIndex={this.getScrollIndex()}
      initialNumToRender={30}
      data={this.state.list}
      keyExtractor={(item, index) => index}
      renderItem={({ item }) => this.renderItem(item)}
    />
  )

  renderItem = ({ value, key }) => {
    const selected = this.state.selected === key ? styles.selected : [];
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(key)}
        style={[styles.pickerItem, selected]}
      >
        <AppText
          size={14}
          numberOfLines={1}
          ellipsizeMode="middle"
          key={key}
        >
          {value}
        </AppText>
      </TouchableOpacity>
    );
  }

  render() {
    const { height } = this.props;
    return (
      <View style={styles.wrapper}>
        {this.modal()}
        <TouchableOpacity style={[styles.textWrapper, { height }]} onPress={this.showModal}>
          <AppText>{this.state.selected}</AppText>
        </TouchableOpacity>
      </View>
    );
  }
}

Picker.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  height: PropTypes.number,
};

Picker.defaultProps = {
  defaultValue: '',
  height: 80,
};

export default Picker;
