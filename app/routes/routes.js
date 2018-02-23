import React, { Component } from 'react';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { FEED_FILTER_EVERYTHING } from '@config/constant';
import { AppNavigator } from '@routes/routeProvider';
import {
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';

class Router extends Component {
  constructor(props) {
    super(props);
    this.lastBackButtonPress = null;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  }

  shouldCloseApp = (nav) => {
    if (nav.index > 0) return false;

    if (nav.routes) {
      return nav.routes.every(this.shouldCloseApp);
    }

    if (this.lastBackButtonPress + 3000 >= new Date().getTime()) {
      BackHandler.exitApp();
      return true;
    }

    ToastAndroid.show('Press back button again to exit app.', ToastAndroid.SHORT);
    this.lastBackButtonPress = new Date().getTime();
    return false;
  };

  goBack = () => this.props.dispatch(NavigationActions.back());


  handleBackPress = () => {
    if (this.shouldCloseApp(this.props.nav)) {
      return false;
    }

    this.goBack();

    return true;
  }

  render() {
    const addListener = createReduxBoundAddListener('root');
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav,
      addListener,
    });

    return (
      <AppNavigator
        navigation={navigation}
      />
    );
  }
}

Router.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    index: PropTypes.number,
    routes: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({ nav: state.nav });

export default connect(mapStateToProps)(Router);
