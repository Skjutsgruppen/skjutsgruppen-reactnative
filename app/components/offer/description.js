import React, { PureComponent } from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import AddPhoto from '@components/add/photo';
import CommentBox from '@components/add/commentBox';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  infoText: {
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 24,
    color: Colors.text.gray,
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    alignSelf: 'center',
    width: '50%',
    marginTop: '15%',
    marginBottom: 80,
    marginHorizontal: 20,
  },
});


class Description extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { text: '', photo: null };
  }

  componentWillMount() {
    const { text, photo } = this.props.defaultValue;
    this.setState({ text, photo });
  }

  onNext = () => {
    const { onNext } = this.props;
    onNext(this.state);
  }

  render() {
    const { photo } = this.state;
    const { isOffer } = this.props;

    return (
      <Container>
        <AddPhoto onSelect={res => this.setState({ photo: res.data })} iconColor={isOffer ? 'pink' : 'blue'} defaultPhoto={photo} />
        <CommentBox
          label={trans('add.comment')}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          labelColor={isOffer ? Colors.text.pink : Colors.text.blue}
        />
        <Text style={styles.infoText}>
          {trans('add.write_about_who_you_are')}
        </Text>
        <RoundedButton
          onPress={this.onNext}
          bgColor={Colors.background.pink}
          style={styles.button}
        >
          {trans('global.next')}
        </RoundedButton>
      </Container>
    );
  }
}

Description.propTypes = {
  defaultValue: PropTypes.shape({
    photo: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  onNext: PropTypes.func.isRequired,
  isOffer: PropTypes.bool,
};

Description.defaultProps = {
  isOffer: false,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Description);
