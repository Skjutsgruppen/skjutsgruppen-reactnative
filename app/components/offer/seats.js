import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import CommentBox from '@components/add/commentBox';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    paddingBottom: 50,
  },
  button: {
    width: 200,
    alignSelf: 'center',
    marginTop: '10%',
    marginBottom: 50,
    marginHorizontal: 20,
  },
});

class Seats extends Component {
  constructor(props) {
    super(props);
    this.state = { seat: '' };
  }

  componentWillMount() {
    const { defaultValue } = this.props;
    this.setState({ seat: defaultValue });
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state.seat);
  };

  render() {
    return (
      <View style={styles.wrapper}>
        <CommentBox
          label="How many seats do you offer?"
          defaultValue={this.state.seat}
          onChangeText={seat => this.setState({ seat })}
          value={this.state.text}
          maxLength={2}
          keyboardType="numeric"
          inputStyle={{ textAlign: 'center' }}
        />
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          Next
        </RoundedButton>
      </View>
    );
  }
}

Seats.propTypes = {
  onNext: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
};

Seats.defaultProps = {
  defaultValue: '3',
};

export default Seats;
