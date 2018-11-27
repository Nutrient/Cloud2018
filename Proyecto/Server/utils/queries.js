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
      "serverTime": { "$add": [new Date(0),"$serverTime"]}
    }
  },
  {
    "$group": {
      "_id": {"$dateToString": { "format": "%Y-%m-%d", "date": "$serverTime" }},
      "scores": {
        "$push": {
          "sentiment": "$sentiment",
          "avgScore": {"$avg": "$score"}
        }
      }
    }
  }
]);


module.exports.userStatsGeneral = (userID) =>  ([
    {
      "$match": {
        "userID": {
          "$eq": userID.toUpperCase()
        }
      }
    },
    {
      "$group": {
        "_id": "$sentiment",
        "userID": {"$first": "$userID"},
        "avgScore": {"$avg": "$score"}
      }
    }
  ]);
module.exports.userStatsChannel = (channelID, userID) =>  ([
    {
      "$match": {
        "userID": {
          "$eq": userID.toUpperCase()
        },
        "channelID": {
          "$eq": channelID.toString()
        }
      }
    },
    {
      "$group": {
        "_id": "$sentiment",
        "userID": {"$first": "$userID"},
        "avgScore": {"$avg": "$score"}
      }
    }
  ]);
