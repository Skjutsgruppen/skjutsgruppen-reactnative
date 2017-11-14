import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TabIcon from '@components/tabIcon';
import { Wrapper } from '@components/common';
import Colors from '@theme/colors';

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
  lightText: {
    color: Colors.text.gray,
  },
  blueText: {
    color: Colors.text.blue,
  },
  textWrap: {
    flex: 1,
    flexWrap: 'wrap',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.background.fullWhite,
    borderRadius: 18,
    overflow: 'hidden',
  },
  iconWrapper: {
    height: 36,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  searchInput: {
    fontSize: 14,
    height: 36,
    flex: 1,
    paddingLeft: 18,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background.fullWhite,
  },
  section: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border.lightGray,
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 16,
    color: Colors.text.blue,
    marginHorizontal: 24,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  profilePicWrapper: {
    flexDirection: 'row',
    marginRight: 8,
  },
  profilePic: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
    marginRight: 4,
  },
  time: {
    left: 'auto',
  },
  actions: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  accept: {
    marginRight: 8,
  },
  chevron: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});

class Message extends Component {
  static navigationOptions = {
    header: null,
    tabBarLabel: 'Message',
    tabBarIcon: ({ focused, tintColor }) => (
      <TabIcon
        iconDefault="ios-chatboxes-outline"
        iconFocused="ios-chatboxes"
        focused={focused}
        tintColor={tintColor}
      />
    ),
  };

  render() {
    return (
      <Wrapper bgColor={Colors.background.cream}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages and groups</Text>
          <View style={styles.searchInputWrapper}>
            <TextInput
              placeholder="Search"
              underlineColorAndroid="transparent"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.iconWrapper}>
              <Image
                source={require('../../assets/icons/icon_search_blue.png')}
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <ScrollView>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {('REQUESTS'.toUpperCase())}
              </Text>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <Text style={styles.textWrap}>
                      <Text style={[styles.bold, styles.blueText]}>Adam </Text>
                      <Text>
                        has requested to join your
                        <Text style={styles.bold}> Gothemburg - Barcelona </Text>
                        group
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.accept}>
                      <Icon
                        name="ios-checkmark-circle-outline"
                        size={32}
                        color={Colors.text.blue}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Icon
                        name="ios-close-circle-outline"
                        size={32}
                        color={Colors.text.red}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {('New'.toUpperCase())}
              </Text>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text style={[styles.clipedText, styles.bold]}>Lovisa</Text>
                      <Text style={[styles.clipedText, styles.bold]}>Gothemburg - Barcelona</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={[styles.time, styles.bold]}>17:58</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text style={[styles.clipedText, styles.bold]}>Johline + 3</Text>
                      <Text style={[styles.clipedText, styles.bold]}>London - Cambridge...</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={[styles.time, styles.bold]}>Tue</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text style={[styles.clipedText, styles.bold]}>Pernilla</Text>
                      <Text style={[styles.clipedText, styles.bold]}>
                        Just joined the movement!
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={[styles.time, styles.bold]}>Feb 7</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {('Your active rides'.toUpperCase())}
              </Text>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text>Gothemburg - Barcelona</Text>
                      <Text style={styles.lightText}>OCT 20, 09.00</Text>
                    </View>
                  </View>
                  <View>
                    <Image
                      source={require('../../assets/icons/icon_chevron_right.png')}
                      style={styles.chevron}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text style={styles.clipedText}>Upssala - Lulea</Text>
                      <Text style={styles.lightText}>DEC 20, 10.30</Text>
                    </View>
                  </View>
                  <View>
                    <Image
                      source={require('../../assets/icons/icon_chevron_right.png')}
                      style={styles.chevron}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {('Your groups'.toUpperCase())}
              </Text>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text>Daily commute to town</Text>
                    </View>
                  </View>
                  <View>
                    <Image
                      source={require('../../assets/icons/icon_chevron_right.png')}
                      style={styles.chevron}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {('Old messages'.toUpperCase())}
              </Text>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text style={styles.clipedText}>Lasse</Text>
                      <Text style={styles.clipedText}>Tagged you in an experience</Text>
                    </View>
                  </View>
                  <View>
                    <Text>Jan 20</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.list}>
                  <View style={styles.flexRow}>
                    <View style={styles.profilePicWrapper}>
                      <Image
                        source={require('../../assets/profilePic.jpg')}
                        style={styles.profilePic}
                      />
                    </View>
                    <View>
                      <Text style={styles.clipedText}>Lovisa</Text>
                      <Text style={styles.clipedText}>Gothemburg - Barcelona</Text>
                    </View>
                  </View>
                  <View>
                    <Text>Jan 20</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Wrapper>
    );
  }
}

export default Message;
