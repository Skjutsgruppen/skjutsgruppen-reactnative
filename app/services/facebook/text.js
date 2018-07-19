class Text {
  commentedOnTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: `I've asked ${user} to share a ride between ${tripStart} and ${tripEnd} on ${date}. Click below to see the ride.`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  askedTrip = ({ tripStart, tripEnd, date, id }) => {
    return {
      quote: `I want to share a ride between ${tripStart} and ${tripEnd} on ${date}. Do anyone have a suggestion?`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  offeredTrip = ({ tripStart, tripEnd, date, id }) => {
    return {
      quote: `I'm offering a ride between ${tripStart} and ${tripEnd} on ${date}. Would you like to join?`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  createdGroup = ({ name, id }) => {
    return {
      quote: `I've just added the group ${name} at The #RidesharingMovement. Would you like to rideshare with us?`,
      contentUrl: `https://web.skjutsgruppen.nu/g/${id}`,
      // commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  publishedExperience = ({ id }) => {
    return {
      quote: 'An Experience with The ',
      contentUrl: `https://web.skjutsgruppen.nu/e/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement, #ShareAlike, #ridesharing' },
    };
  }

  shareOfferedTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: `${user} offers a ride between ${tripStart} and ${tripEnd} on ${date}.`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  shareAskedTrip = ({ user, tripStart, tripEnd, date, id }) => {
    return {
      quote: `${user} asks for a ride between ${tripStart} and ${tripEnd} on ${date}.`,
      contentUrl: `https://web.skjutsgruppen.nu/t/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  shareGroup = ({ name, id }) => {
    return {
      quote: `Check out the group ${name} at The #RidesharingMovement.`,
      contentUrl: `https://web.skjutsgruppen.nu/g/${id}`,
      // commonParameters: { hashtag: '#RidesharingMovement' },
    };
  }

  shareLocation = ({ id }) => {
    return {
      quote: "I'm ridesharing right now! See where I am live on this map",
      contentUrl: `https://web.skjutsgruppen.nu/l/${id}`,
      commonParameters: { hashtag: '#RidesharingMovement #ShareAlike' },
    };
  }
}

export default new Text();
