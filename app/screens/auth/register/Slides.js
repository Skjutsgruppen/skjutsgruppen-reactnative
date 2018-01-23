import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Wrapper } from '@components/common';
import { SlideOne, SlideTwo, SlideThree, SlideFour, SlideFive } from '@components/auth/register/slides';
import Colors from '@theme/colors';

class RegisterSlides extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 1,
      totalSlide: 5,
    };
  }

  setActiveSlide = (activeSlide) => {
    this.setState({ activeSlide });
  }

  goBack = () => {
    const { navigation } = this.props;

    navigation.goBack();
  }

  redirect = () => {
    const { navigation } = this.props;

    navigation.navigate('RegisterMethod');
  }

  renderSlides = () => {
    const { activeSlide } = this.state;

    if (activeSlide === 1) {
      return (
        <SlideOne
          goBack={this.goBack}
          setActiveSlide={this.setActiveSlide}
        />
      );
    }

    if (activeSlide === 2) {
      return (
        <SlideTwo setActiveSlide={this.setActiveSlide} />
      );
    }

    if (activeSlide === 3) {
      return (
        <SlideThree setActiveSlide={this.setActiveSlide} />
      );
    }

    if (activeSlide === 4) {
      return (
        <SlideFour setActiveSlide={this.setActiveSlide} />
      );
    }

    return (
      <SlideFive
        setActiveSlide={this.setActiveSlide}
        redirect={this.redirect}
      />
    );
  }

  render() {
    return (
      <Wrapper bgColors={Colors.background.cream}>
        {this.renderSlides()}
      </Wrapper>
    );
  }
}

RegisterSlides.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};

export default RegisterSlides;
