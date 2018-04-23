import React, { PureComponent } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '@theme/colors';
import { withMyTrips } from '@services/apollo/trip';
import { withConversation } from '@services/apollo/profile';
import { withMyGroups, withGroupMembers, withSearchGroup } from '@services/apollo/group';
import { withFriends } from '@services/apollo/friend';
import PropTypes from 'prop-types';
import SearchMyTrips from '@components/profile/SearchMyTrips';
import SearchMyConversations from '@components/profile/SearchMyConversations';
import SearchMyGroups from '@components/profile/SearchMyGroups';
import SearchExploreGroups from '@components/group/SearchExploreGroups';
import SearchMyFriends from '@components/profile/SearchMyFriends';
import SearchEnabler from '@components/group/enablers/enablerList';
import SearchAddEnabler from '@components/group/enablers/addEnablerList';
import SearchParticipant from '@components/group/participant/participantList';
import { trans } from '@lang/i18n';

const TripsSearchResult = withMyTrips(SearchMyTrips);
const ConversationSearchResult = withConversation(SearchMyConversations);
const GroupsSearchResult = withMyGroups(SearchMyGroups);
const ExploreGroupsSearchResult = withSearchGroup(SearchExploreGroups);
const FriendsSearchResult = withFriends(SearchMyFriends);
const EnablersSearchResult = withGroupMembers(SearchEnabler);
const AddEnablersSearchResult = withGroupMembers(SearchAddEnabler);
const ParticipantSearchResult = withGroupMembers(SearchParticipant);

const styles = StyleSheet.create({
  wrapper: {
    padding: '20%',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 32,
    marginVertical: 16,
    textAlign: 'center',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.fullWhite,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowColor: '#000',
    height: 80,
  },
  searchInput: {
    fontSize: 15,
    height: 36,
    flex: 1,
    borderRadius: 18,
    paddingLeft: 16,
    marginRight: 16,
  },
  closeIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginHorizontal: 16,
    opacity: 0.5,
  },
});

class ListSearchModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { searchQuery: '' };
  }

  render() {
    const {
      searchCategory,
      onClose,
      onPress,
      type,
      id,
      onExperienceIconPress,
      handleRemovePress,
      unfriend,
      isAdmin,
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.searchInputWrapper]}>
          <TextInput
            placeholder={trans('search.search')}
            onChangeText={text => this.setState({ searchQuery: text })}
            underlineColorAndroid="transparent"
            style={styles.searchInput}
            returnKeyType="search"
            autoFocus
          />
          <TouchableOpacity onPress={() => onClose()}>
            <Image
              source={require('@assets/icons/ic_cross.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        {searchCategory === 'trips' &&
          <TripsSearchResult
            onExperiencePress={onExperienceIconPress}
            id={id}
            onPress={onPress}
            type={type}
            applyQueryString
            active={null}
            queryString={this.state.searchQuery}
          />}
        {searchCategory === 'conversations' &&
          <ConversationSearchResult
            onExperiencePress={onExperienceIconPress}
            onPress={onPress}
            applyQueryString
            queryString={this.state.searchQuery}
          />}
        {searchCategory === 'groups' &&
          <GroupsSearchResult
            id={id}
            onPress={onPress}
            applyQueryString
            queryString={this.state.searchQuery}
          />}
        {
          searchCategory === 'exploreGroups' && this.state.searchQuery.length > 0 &&
          <ExploreGroupsSearchResult
            onPress={onPress}
            keyword={this.state.searchQuery}
            queryString={this.state.searchQuery}
          />
        }
        {searchCategory === 'friends' &&
          <FriendsSearchResult
            id={id}
            onPress={onPress}
            applyQueryString
            queryString={this.state.searchQuery}
            handleRemovePress={handleRemovePress}
            unfriend={unfriend}
          />}
        {searchCategory === 'enabler' &&
          <EnablersSearchResult
            id={id}
            onPress={onPress}
            applyQueryString
            queryString={this.state.searchQuery}
            enabler
            isSearching
            isAdmin={isAdmin}
          />
        }
        {searchCategory === 'addEnabler' &&
          <AddEnablersSearchResult
            id={id}
            onPress={onPress}
            applyQueryString
            queryString={this.state.searchQuery}
            excludeEnabler
            isSearching
          />
        }
        {searchCategory === 'participants' &&
          <ParticipantSearchResult
            id={id}
            onPress={onPress}
            applyQueryString
            queryString={this.state.searchQuery}
            isSearching
            isAdmin={isAdmin}
          />
        }
      </View>
    );
  }
}

ListSearchModal.propTypes = {
  searchCategory: PropTypes.string.isRequired,
  id: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onExperienceIconPress: PropTypes.func,
  handleRemovePress: PropTypes.func,
  unfriend: PropTypes.bool,
  isAdmin: PropTypes.bool,
};

ListSearchModal.defaultProps = {
  id: null,
  type: null,
  onExperienceIconPress: null,
  handleRemovePress: null,
  unfriend: false,
  isAdmin: false,
};

export default ListSearchModal;
