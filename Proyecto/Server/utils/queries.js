module.exports.topFive = (channelID, sentiment) => ([
  {
    "$match": {
      "channelID": {
        "$eq": channelID.toString()
      },
      "sentiment": {
        "$eq": sentiment.toUpperCase()
      }
    }
  },
  {
    "$group": {
      "_id": "$userID",
      "avgScore": {"$avg": "$score"}
    }
  },
  {
    "$limit": 5
  }
]);

module.exports.userTimeline = (channelID, userID) => ([
  {
    "$match": {
      "channelID": {
        "$eq": channelID.toString()
      },
      "userID": {
        "$eq": userID.toUpperCase()
      }
    }
  },
  {
    "$group": {
      "_id": "$userID",
      "date": {
        "$add": [new Date(0), "$serverTime"]
      },
      "avgScore": {"$avg": "$score"}
    }
  }
]);
