module.exports.topFive = (channelID, sentiment) => ([
  {
    "$match": {
      "channelID": {
        "$eq": channelID
      },
      "Sentiment": {
        "$eq": sentiment.toUpperCase()
      }
    }
  },
  {
    "$group": {
      "_id": "$userID",
      "avgScore": {"$avg": "score"}
    }
  },
  {
    "$limit": 5
  }
]);
