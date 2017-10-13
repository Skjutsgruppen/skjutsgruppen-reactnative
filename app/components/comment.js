import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Loading } from '@components/common';

const styles = StyleSheet.create({
  lightText: {
    color: '#777777',
  },
  tab: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1db0ed',
  },
  feed: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 6,
    marginLeft: 6,
    marginBottom: 16,
    borderColor: '#cccccc',
    borderBottomWidth: 4,
  },
  feedContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  feedTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  feedImg: {
    width: '100%',
  },
  profilePic: {
    height: 55,
    width: 55,
    borderRadius: 36,
    marginRight: 12,
  },
  name: {
    color: '#1db0ed',
    fontWeight: 'bold',
    paddingRight: 8,
  },
  time: {
    color: '#777777',
  },
  commentWrapper: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  commentText: {
    marginTop: 2,
    lineHeight: 20,
    color: '#000',
  },
  feedAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 2,
    borderColor: '#dddee3',
  },
  verticalDevider: {
    width: 1,
    backgroundColor: '#dddddd',
    height: '70%',
    alignSelf: 'center',
  },
  newGroupInfoWrapper: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#00000011',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newGroupNameWrapper: {
    borderColor: '#ffffff',
    borderBottomWidth: 2,
    marginBottom: 16,
    paddingBottom: 16,
  },
  newGroupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  newGroupPlace: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
  },
  newGroupInfo: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
  },
});

class Comment extends Component {
  componentWillMount() {
    console.log('here');
  }

  componentWillReceiveProps() {
    console.log('update');
  }

  render() {
    const { comments, loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <View>
          <Text>{error}</Text>
        </View>
      );
    }

    if (comments && comments.length < 1) {
      return (
        <View>
          <Text>No Comment</Text>
        </View>
      );
    }

    let image = '';

    return (
      <View>
        {comments.map((comment) => {
          if (comment.User.photo) {
            image = (<Image source={{ uri: comment.User.photo }} style={styles.profilePic} />);
          } else {
            image = (<View style={styles.imgIcon} />);
          }
          return (
            <View key={comment.id} style={styles.commentWrapper}>
              {image}
              <View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={styles.name}>{comment.User.firstName || comment.User.email}</Text>
                  <Text style={styles.time}>{comment.date}</Text>
                </View>
                <View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

export default Comment;