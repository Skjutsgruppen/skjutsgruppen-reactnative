import React, { Component } from 'react';
import { View, StyleSheet, Image, Platform, BackHandler } from 'react-native';
import { RoundedButton, Loading, AppNotification } from '@components/common';
import ToolBar from '@components/utils/toolbar';
import { Colors } from '@theme';
import { OPEN_GROUP } from '@config/constant';
import { Heading, AppText } from '@components/utils/texts';
import EmbedMobile from '@assets/icons/embed_mobile.png';
import EmbedWeb from '@assets/icons/embed_web.png';
import { trans } from '@lang/i18n';
import PropTypes from 'prop-types';
import { withEmbed } from '@services/apollo/share';
import { compose } from 'react-apollo';
import ErrorIcon from '@assets/icons/ic_warning.png';
import SuccessIcon from '@assets/icons/ic_checked_green.png';


const styles = StyleSheet.create({
  mainTitle: {
    marginTop: 45,
    textAlign: 'center',
  },
  embedContainer: {
    alignItems: 'center',
  },
  embedImages: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 38,
  },
  embedContentWrapper: {
    maxWidth: 360,
    paddingHorizontal: 40,
  },
  // openGroup: {
  //   paddingHorizontal: 55,
  // },
  closeGroup: {
    maxWidth: 360,
  },
  buttonWrapper: {
    padding: 16,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
    alignItems: 'center',
  },
  embedDescription: {
    lineHeight: 30,
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 24,
    marginTop: 30,
    marginBottom: 20,
  },
  embedNotification: {
    lineHeight: 26,
  },
});

class EmbedGroup extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      notification: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }

  onEmbed = () => {
    const { embed, navigation } = this.props;
    const { id } = navigation.state.params;

    if (id) {
      this.setState({ loading: true });
      embed({ tripId: id })
        .then(() => this.setState({ loading: false, error: false, notification: true }))
        .catch((err) => { console.log(err); this.setState({ loading: false, error: true, notification: true }); });
    }
  }

  onCloseNotification = () => {
    this.setState({ notification: false });
  }


  renderEmbedContent = () => (
    <View style={styles.embedContentWrapper}>
      <AppText size={16} style={styles.embedDescription} centered>{trans('trip.get_the_html_code')}</AppText>
      <View style={styles.buttonWrapper}>
        {this.state.loading ?
          <Loading /> :
          <RoundedButton
            bgColor={Colors.background.pink}
            style={styles.button}
            onPress={() => this.onEmbed()}
          >
            {trans('group.email_the_code')}
          </RoundedButton>
        }
      </View>
      <AppText centered size={16} color={Colors.text.darkGray} style={styles.embedNotification}>{trans('trip.creator_of_ride')}</AppText>
    </View>
  )

  render() {
    const { notification, error } = this.state;
    const notificationMessage = error ? 'Email was not sent' : 'Email sent successfully';
    return (
      <View>
        {notification && <AppNotification
          image={error ? ErrorIcon : SuccessIcon}
          type="icon"
          message={notificationMessage}
          handleClose={this.onCloseNotification}
        />}
        <ToolBar title={trans('trip.embed_this_trip')} />
        <Heading
          size={24}
          style={styles.mainTitle}
          fontVariation="bold"
          color={Colors.text.pink}
        > {trans('group.wherever_you_want')}
        </Heading>
        <View style={styles.embedContainer}>
          <View style={styles.embedImages}>
            <Image source={EmbedWeb} style={{ marginRight: 36 }} />
            <Image source={EmbedMobile} />
          </View>
          {this.renderEmbedContent()}
        </View>
      </View>
    );
  }
}

EmbedGroup.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        type: PropTypes.string,
        id: PropTypes.number,
      }),
    }).isRequired,
  }).isRequired,
  embed: PropTypes.func.isRequired,
};

export default compose(withEmbed)(EmbedGroup);
