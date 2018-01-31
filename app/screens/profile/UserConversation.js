import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { withConversation } from '@services/apollo/profile';
import { FloatingNavbar, Wrapper } from '@components/common';
import Colors from '@theme/colors';
import DataList from '@components/dataList';
import ConversationItem from '@components/profile/card/conversation';
import { FEEDABLE_TRIP, FEEDABLE_GROUP } from '@config/constant';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.background.white,
    paddingBottom: 12,
    paddingTop: 60,
  },
});

class UserConversation extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  onPress = (type, detail) => {
    const { navigation } = this.props;

    if (type === FEEDABLE_TRIP) {
      navigation.navigate('TripDetail', { trip: detail });
    }

    if (type === FEEDABLE_GROUP) {
      navigation.navigate('GroupDetail', { group: detail });
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  render() {
    const { conversations } = this.props;

    return (
      <Wrapper bgColor={Colors.background.white}>
        <FloatingNavbar handleBack={this.goBack} />
        <View style={styles.listWrapper}>
          <DataList
            data={conversations}
            renderItem={({ item }) =>
              <ConversationItem conversation={item} onPress={this.onPress} />
            }
            fetchMoreOptions={{
              variables: { offset: conversations.rows.length },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult || fetchMoreResult.conversations.rows.length === 0) {
                  return previousResult;
                }

                const rows = previousResult.conversations.rows.concat(
                  fetchMoreResult.conversations.rows,
                );

                return { conversations: { ...previousResult.conversations, ...{ rows } } };
              },
            }}
          />
        </View>
      </Wrapper>
    );
  }
}

UserConversation.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  conversations: PropTypes.shape({
    rows: PropTypes.array,
  }).isRequired,
};

export default withConversation(UserConversation);
