const MongoClient = require('mongodb').MongoClient;
const AWS = require('aws-sdk');

const s3 = new AWS.S3({region: 'us-east-1'});
const queries = require('../utils/queries');

let client = undefined;

const storeResult = async (key, body ) => {
  let obj = {
    Bucket: 'cloud2018final',
    Key: key,
    Body: JSON.stringify(body),
    ContentType: "application/json"
  }

  try {
    let result = await s3.putObject(obj).promise();
  } catch (e) {
    console.log(e);
    throw e;
  }
}


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
      let url = '';
      try {
        result = await client.db('moody').collection('discord').aggregate(queries.topFive(req.body.channelID, req.body.Sentiment)).toArray();
        let key = `${req.body.channelID}-${req.body.Sentiment}-${Date.now()}.json`;
        await storeResult(key, {Sentiment: req.body.Sentiment, type: 0, result: result});
        url = `http://ec2-35-153-138-183.compute-1.amazonaws.com/topFive/${key}`;

      } catch (e) {
        console.log(e);
      }

      res.send(url);
  });

  fastify.get('/topFive/:result', async (req, res) => {
    
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
