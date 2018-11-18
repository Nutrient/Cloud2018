const MongoClient = require('mongodb').MongoClient;

const queries = require('../utils/queries');

let client = undefined;


module.exports = (fastify, opts, next) => {

  fastify.post('/topFive', async (req, res) => {
      //channelID, emotion
      //provides information of the top 5 channel members that have have the higuest stats on this emotion
      if(!client){
        client = await MongoClient.connect('mongodb://localhost:27017', {
          useNewUrlParser: true
        });
      }
      let result = {};
      try {
        let result = await client.db('moody').collection('discord').aggregate(queries.topFive(req.body.channelID, req.body.Sentiment));
      } catch (e) {
        console.log(e);
      }

      res.send(result);
  });

  fastify.post('/userTimeline', async (req, res) => {
    //userId, channelID
    //provides information of a user's emotions per day
    res.send({});
  });

  fastify.post('/userStats', async (req, res) => {
    //userID
    //provides general information of a user overall channels where the bot its listening
    res.send({});
  });

  fastify.post('/userStatsChannel', async (req, res) => {
    //userId, channelID
    //provides general information of a user in the current channel
  });

  next();
}
