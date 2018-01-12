import React, { Component } from 'react';
import { View, NetInfo } from 'react-native';
import { AppNotification } from '@components/common';
import NoConnectionIcon from '@icons/ic_no_connection.png';

class InternetConnection extends Component {
  constructor(props) {
    super(props);
    this.state = { connectionStatus: null, notification: false };
  }

  componentWillMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    NetInfo.isConnected.fetch().done(
      (connectionStatus) => {
        this.setState({ connectionStatus, notification: !connectionStatus });
      },
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  onCloseNotification = () => {
    this.setState({ notification: false });
  }

  handleConnectionChange = (connectionStatus) => {
    this.setState({ connectionStatus, notification: !connectionStatus });
  }

  render() {
    const { connectionStatus, notification } = this.state;

    return (
      <View>{
        (!connectionStatus && notification)
        && <AppNotification
          type="icon"
          image={NoConnectionIcon}
          message="No internet connection"
          handleClose={this.onCloseNotification}
        />
      }
      </View>
    );
  }
}

export default InternetConnection;
