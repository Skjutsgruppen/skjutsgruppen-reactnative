import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, RoundedButton } from '@components/common';
import Colors from '@theme/colors';
import AddPhoto from '@components/add/photo';
import CommentBox from '@components/add/commentBox';
import { trans } from '@lang/i18n';
import { AppText } from '@components/utils/texts';

const styles = StyleSheet.create({
  infoText: {
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 14,
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
    const { isOffer, user } = this.props;

    return (
      <Container>
        <AddPhoto
          onSelect={res => this.setState({ photo: res.data })}
          iconColor={isOffer ? 'pink' : 'blue'}
          defaultPhoto={photo}
          canAddPhoto={user.isSupporter}
        />
        <CommentBox
          label={trans('add.comment')}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          labelColor={isOffer ? Colors.text.pink : Colors.text.blue}
        />
        <AppText size={15} style={styles.infoText}>{trans('add.write_about_who_you_are')}</AppText>
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
  user: PropTypes.shape({
    id: PropTypes.number,
    isSupporter: PropTypes.bool,
  }).isRequired,
};

Description.defaultProps = {
  isOffer: false,
};

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Description);
