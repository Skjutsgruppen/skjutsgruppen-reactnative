import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import DataList from '@components/dataList';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { RoundedButton, Loading } from '@components/common';
import SuggestedRide from '@components/ask/suggestedRide';
import { submitSuggestion } from '@services/apollo/suggest';
import { getToast } from '@config/toast';
import Toast from '@components/toast';
import { Colors } from '@theme';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.background.mutedBlue,
  },
  navbar: {
    justifyContent: 'center',
    height: 60,
    paddingRight: 20,
  },
  closeIcon: {
    height: 48,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    transform: [
      { rotate: '-90deg' },
    ],
  },
  input: {
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.lightGray,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: Colors.text.blue,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.background.fullWhite,
    elevation: 10,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.25,
  },
  button: {
    width: 200,
    marginBottom: 0,
  },
  centerWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class SuggestedRidesList extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedId: null, error: '', sending: false };
  }

  onSelect = (tripId) => {
    this.setState({
      selectedId: tripId === this.state.selectedId ? null : tripId,
    });
  }

  onSuggest = () => {
    const { tripId, createSuggestion, onSubmit } = this.props;
    const { selectedId } = this.state;

    if (!selectedId) {
      this.setState({ error: getToast(['SELECT_ONE_RIDE']) });
    } else {
      this.setState({ sending: true });
      createSuggestion({
        tripId,
        type: 'trip',
        suggestedTripId: selectedId,
      }).then(() => {
        this.setState({ sending: false });
        onSubmit(false);
      }).catch(error => this.setState({ error: error.message, sending: false }));
    }
  }

  renderNoSuggestion = () => {
    const { onSubmit } = this.props;

    return (
      <View style={styles.centerWrapper}>
        <Text style={{ marginBottom: 20 }}>No any suggestion found for the trip.</Text>
        <RoundedButton
          bgColor={Colors.background.pink}
          onPress={() => onSubmit(false)}
          style={styles.button}
        >
          Go Back
        </RoundedButton>
      </View>
    );
  }

  renderButton = () => {
    const { sending } = this.state;

    if (sending) {
      return (<Loading />);
    }

    return (
      <RoundedButton
        bgColor={Colors.background.pink}
        onPress={() => this.onSuggest()}
        style={styles.button}
      >
        Suggest
      </RoundedButton>
    );
  }

  render() {
    const { search, onSubmit, defaultText } = this.props;
    if (search.networkStatus === 1 && search.length < 1) {
      return (
        <View style={styles.centerWrapper}>
          <Loading />
        </View>
      );
    }

    if (search.count < 1 && !search.loading) {
      return this.renderNoSuggestion();
    }

    return (
      <KeyboardAvoidingView style={styles.wrapper} behavior="padding">
        <View style={styles.navbar}>
          <TouchableHighlight
            style={styles.closeIcon}
            underlayColor="#f5f5f5"
            onPress={() => onSubmit(false)}
          >
            <Image source={require('@assets/icons/ic_back.png')} />
          </TouchableHighlight>
        </View>
        <Toast message={this.state.error} type="error" />
        <TextInput
          multiline={false}
          placeholder="Write"
          placeholderTextColor={Colors.text.black}
          underlineColorAndroid="transparent"
          style={styles.input}
          defaultValue={defaultText}
        />
        <View style={{ flex: 1 }}>
          <DataList
            data={search}
            renderItem={({ item }) => (
              <SuggestedRide
                ride={item}
                key={item.id}
                onSelect={this.onSelect}
                selectedId={this.state.selectedId}
              />
            )}
            header={<Text style={styles.label}>SUGGEST A RIDE </Text>}
            shouldRefresh={false}
            fetchMoreOptions={{
              variables: { offset: search.rows.length },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult || fetchMoreResult.search.rows.length === 0) {
                  return previousResult;
                }

                const rows = previousResult.search.rows.concat(
                  fetchMoreResult.search.rows,
                );

                return { search: { ...previousResult.search, ...{ rows } } };
              },
            }}
          />
        </View>
        <View style={styles.footer}>
          {this.renderButton()}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

SuggestedRidesList.propTypes = {
  tripId: PropTypes.number.isRequired,
  search: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    networkStatus: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
    count: PropTypes.number,
    error: PropTypes.object,
    refetch: PropTypes.func,
    fetchMore: PropTypes.func,
  }).isRequired,
  createSuggestion: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultText: PropTypes.string.isRequired,
};


export default compose(submitSuggestion)(SuggestedRidesList);
