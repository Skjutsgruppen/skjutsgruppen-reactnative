import React, { Component } from 'react';
import { View, StyleSheet, Image, Platform, BackHandler } from 'react-native';
import { RoundedButton } from '@components/common';
import ToolBar from '@components/utils/toolbar';
import { Colors } from '@theme';
import { OPEN_GROUP } from '@config/constant';
import { Heading, AppText } from '@components/utils/texts';
import EmbedMobile from '@assets/icons/embed_mobile.png';
import EmbedWeb from '@assets/icons/embed_web.png';
import { trans } from '@lang/i18n';
import PropTypes from 'prop-types';

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
    maxWidth: 374,
  },
  openGroup: {
    paddingHorizontal: 55,
  },
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
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }
  onBackButtonPress = () => {
    const { navigation } = this.props;
    navigation.goBack();
    return true;
  }
  renderEmbedContent = () => {
    if (this.props.navigation.state.params.type === OPEN_GROUP) {
      return (
        <View style={[styles.embedContentWrapper, styles.openGroup]}>
          <AppText size={16} style={styles.embedDescription} centered>{trans('group.get_the_html_code')}</AppText>
          <View style={styles.buttonWrapper}>
            <RoundedButton
              bgColor={Colors.background.pink}
              style={styles.button}
              onPress={() => {}}
            >
              {trans('group.email_the_code')}
            </RoundedButton>
          </View>
          <AppText centered size={16} color={Colors.text.darkGray} style={styles.embedNotification}>{trans('group.enablers_of_the_group')}</AppText>
        </View>
      );
    }
    return (
      <View style={[styles.embedContentWrapper, styles.closeGroup]}>
        <AppText size={16} style={styles.embedDescription} centered>{trans('group.participants_in_open_groups')}</AppText>
        <AppText size={16} style={[styles.embedDescription, { marginTop: 26 }]} centered>{trans('group.this_is_a_closed_group')}</AppText>
        <AppText size={16} style={[styles.embedDescription, { paddingHorizontal: 10 }]} centered >{trans('group.the_settings_need_to_be_changed')}</AppText>
      </View>
    );
  }
  render() {
    return (
      <View>
        <ToolBar title={trans('group.embed_this_group')} />
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
      }),
    }).isRequired,
  }).isRequired,
};

export default EmbedGroup;
