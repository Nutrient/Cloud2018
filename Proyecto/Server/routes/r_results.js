const MongoClient = require('mongodb').MongoClient;
const AWS = require('aws-sdk');
const request = require('request-promise');
const auth = require('../auth.json');

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
        let key = `${req.body.channelID}-${req.body.Sentiment}-${Date.now()}`;
        await storeResult(key, {Sentiment: req.body.Sentiment, type: 0, result: result});
        url = `http://ec2-35-153-138-183.compute-1.amazonaws.com/topFive/${key}`;

      } catch (e) {
        console.log(e);
      }

      res.send(url);
  });

  fastify.get('/topFive/:result', async (req, res) => {

    let users = [];
    let userdata = [];
    let title;

    try {
      let result = await s3.getObject({Bucket: 'cloud2018final', Key: req.params.result}).promise();
      let jsonResult = JSON.parse(result.Body.toString('utf8'));
      title = jsonResult.Sentiment;
      for (user of jsonResult.result) {
        let reqResult = await request({
          method: 'GET',
          uri: `https://discordapp.com/api/v6/users/${user._id}`,
          headers: {
            'Authorization': `Bot ${auth.token}`
          },
          json: true
        });
        console.log(reqResult);
        users.push(`"${reqResult.username}#${reqResult.discriminator}"`);
        userdata.push(+user.avgScore);
      }

      console.log(title, users, userdata);

    } catch (e) {
      console.log(e);
      throw e;
    }
    res.header('Content-Type', 'text/html')
    res.type('text/html')
    res.send(require('../public/html/result')(title, users, userdata))



  });

  fastify.post('/userTimeline', async (req, res) => {
    //userId, channelID
    //provides information of a user's emotions per day
    if(!client){
      client = await MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
      });
    }
    res.send({});
  });

  fastify.get('/userTimeline/:result', async (req, res) => {

  });

  fastify.post('/userStats', async (req, res) => {
    //userID
    //provides general information of a user overall channels where the bot its listening
    if(!client){
      client = await MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
      });
    }
    res.send({});
  });

  fastify.get('/userStats/:result', async (req, res) => {

  });

  fastify.post('/userStatsChannel', async (req, res) => {
    //userId, channelID
    //provides general information of a user in the current channel
    if(!client){
      client = await MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
      });
    }
  });

  fastify.get('/userStatsChannel/:result', async (req, res) => {

  });

  next();
}
