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
    "$project": {
      "userID": 1,
      "serverTime": 1,
      "sentiment": 1,
      "score": 1,
      "serverTime": { "$divide": ["$serverTime", 1000*60*60*24]}
    }
  },
  {
    "$group": {
      "_id": "$sentiment",
      "date": {
        "push": {
          "day": "$serverTime",
          "avgScore": {"$avg": "$score"}
        }
      }
    }
  }
]);
