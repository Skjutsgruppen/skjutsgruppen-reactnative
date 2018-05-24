import React from 'react';
import { StyleSheet, View, Modal, Linking } from 'react-native';
import { AppText } from '@components/utils/texts';
import PropTypes from 'prop-types';
import Colors from '@theme/colors';
import TouchableHighlight from '@components/touchableHighlight';
import { trans } from '@lang/i18n';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  horizontalDivider: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.gray,
    opacity: 0.25,
  },
  content: {
    marginVertical: 20,
    paddingTop: 20,
    borderRadius: 20,
    backgroundColor: Colors.background.fullWhite,
    elevation: 5,
  },
  message: {
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 20,
  },
});

const CoCreateModal = ({ visible, toggleCoCreateModalVisibility }) => {
  const openLink = (link) => {
    Linking.canOpenURL(link).then((supported) => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.warn('Cannot open given URL.');
      }
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={() => toggleCoCreateModalVisibility(false)}
    >
      <View style={styles.backdrop}>
        <View style={[styles.content, styles.message]}>
          <AppText
            color={Colors.text.pink}
            fontVariation="bold"
            size={24}
            centered
            style={{ marginBottom: 24, paddingVertical: 10 }}
          >
            {trans('feed.cocreate_this_app')}
          </AppText>
          <View style={styles.horizontalDivider} />
          <TouchableHighlight
            onPress={() => {
              toggleCoCreateModalVisibility(false);
              openLink(trans('feed.trello_url'));
            }}
          >
            <View style={[styles.message]}>
              <AppText
                centered
                fontVariation="semibold"
                style={{ marginBottom: 12 }}
              >{trans('feed.found_something_wrong')}
              </AppText>
              <AppText
                centered
                fontVariation="semibold"
                color={Colors.text.blue}
              >{trans('feed.add_what_you_found_on_our_trello')}
              </AppText>
            </View>
          </TouchableHighlight>
          <View style={styles.horizontalDivider} />
          <TouchableHighlight
            onPress={() => {
              toggleCoCreateModalVisibility(false);
              openLink(trans('feed.github_url'));
            }}
          >
            <View style={[styles.message]}>
              <AppText
                centered
                fontVariation="semibold"
                style={{ marginBottom: 12 }}
              >
                {trans('feed.improve_the_code')}
              </AppText>
              <AppText
                centered
                fontVariation="semibold"
                color={Colors.text.blue}
              >
                {trans('feed.contribute_to_our_open_source_code')}
              </AppText>
            </View>
          </TouchableHighlight>
          <View style={styles.horizontalDivider} />
          <TouchableHighlight
            onPress={() => toggleCoCreateModalVisibility(false)}
          >
            <AppText
              centered
              fontVariation="semibold"
              color={Colors.text.blue}
              style={{ paddingVertical: 20 }}
            >
              {trans('feed.start_using_the_app')}
            </AppText>
          </TouchableHighlight>
        </View>
      </View>
    </Modal >
  );
};

CoCreateModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  toggleCoCreateModalVisibility: PropTypes.func.isRequired,
};

export default CoCreateModal;
