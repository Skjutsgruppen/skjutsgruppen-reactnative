import React, { Component } from 'react';
import {
  View,
  Dimensions,
  WebView,
  Platform,
} from 'react-native';

const injectedScript = function() {
  function waitForBridge() {
    if (window.postMessage.length !== 1){
      setTimeout(waitForBridge, 200);
    }
    else {
      postMessage(
        Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight)
      )
    }
  }
  waitForBridge();
};

const linkScript = function() {
  var attachEvent = function(elem, event, callback)
  {
      event = event.replace(/^on/g, '');
     
      if ( 'addEventListener' in window ) {
          elem.addEventListener(event, callback, false);            
      } else if ( 'attachEvent' in window ) {
          elem.attachEvent('on'+event, callback);            
      } else {
          var registered = elem['on' + event];
          elem['on' + event] = registered ? function(e) {
              registered(e);
              callback(e);
          } : callback;
      }
      
      return elem;
  };
  var all_links = document.querySelectorAll('a[href]');
  if ( all_links ) {
      for ( var i in all_links ) {
          if ( all_links.hasOwnProperty(i) ) {
              attachEvent(all_links[i], 'onclick', function(e){
                alert(e.target);
                  if (new RegExp( '^https?:\/\/' + location.host, 'gi' ).test( this.href ) || new RegExp( '^http?:\/\/' + location.host, 'gi' ).test( this.href ) ) {
                    e.preventDefault();
                    window.postMessage(JSON.stringify({
                      external_url_open: this.href
                    }));
                    return;
                  }
                  e.preventDefault();
               
              });
          }
      }
  }
};

export default class AutoHeightWebView extends Component {
  state = {
    webViewHeight: Number
  };

  static defaultProps = {
      autoHeight: true,
  }

  constructor (props: Object) {
    super(props);
    this.state = {
      webViewHeight: this.props.defaultHeight
    }

    this._onMessage = this._onMessage.bind(this);
  }

  _onMessage(e) {
    console.log('====== onMessage ======', e.nativeEvent.data);
    let data = e.nativeEvent.data;
    if(!data) return;
    data = JSON.parse(data)
    console.log('data ===== ',data);
    console.log('url ===== ', data.external_url_open)
    if(data.external_url_open){
      this.props.openLink(data.external_url_open);
      return; 
    }
    this.setState({
      webViewHeight: parseInt(e.nativeEvent.data)
    });
  }

  stopLoading() {
    this.webview.stopLoading();
  }

  reload() {
    this.webview.reload();
  }

  render () {
    const _w = this.props.width || Dimensions.get('window').width;
    const _h = this.props.autoHeight ? this.state.webViewHeight : this.props.defaultHeight;
  
    const androidScript = 'window.postMessage = String(Object.hasOwnProperty).replace(\'hasOwnProperty\', \'postMessage\');' +
    '(' + String(linkScript) + ')();' +
    '(' + String(injectedScript) + ')();';
    
    const iosScript = '(' + String(injectedScript) + ')();' + 'window.postMessage = String(Object.hasOwnProperty).replace(\'hasOwnProperty\', \'postMessage\');';
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        injectedJavaScript={Platform.OS === 'ios' ? iosScript : androidScript}
        scrollEnabled={this.props.scrollEnabled || false}
        onMessage={this._onMessage}
        javaScriptEnabled={true}
        automaticallyAdjustContentInsets={true}
        {...this.props}
        style={[{width: _w}, this.props.style, {height: _h}]}
      />
    )
  }
}
