import React, { Component } from 'react';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BackHandler } from 'react-native';
import { AppNavigator } from './routeProvider';

class Router extends Component {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  shouldCloseApp = (nav) => {
    if (nav.index > 0) return false;

    if (nav.routes) {
      return nav.routes.every(this.shouldCloseApp);
    }

    return true;
  };

  goBack = () => this.props.dispatch(NavigationActions.back());


  handleBackPress = () => {
    if (this.shouldCloseApp(this.props.nav)) {
      return false;
    }

    this.goBack();

    return true;
  }


  addNavigationHelpers = (navigation) => {
    const original = addNavigationHelpers(navigation);
    let debounce;
    return {
      ...original,

      reset: (routeName, params, action) => {
        const resetAction = NavigationActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName, params, action })],
        });
        navigation.dispatch(resetAction);
      },

      navigateWithDebounce: (routeName, params, action) => {
        const func = () => {
          clearTimeout(debounce);
          debounce = setTimeout(() => {
            navigation.dispatch(NavigationActions.navigate({
              routeName,
              params,
              action,
            }));
          }, 100);
        };
        return func();
      },
    };
  };

  render() {
    const { dispatch, nav } = this.props;
    const navigation = this.addNavigationHelpers({
      dispatch,
      state: nav,
    });

    return (<AppNavigator navigation={navigation} />);
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
