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
        client = await MongoClient.connect('mongodb://35.153.138.183:27017', {
          useNewUrlParser: true
        });
      }
      let result = {};
      let url = '';
      try {
        result = await client.db('moody').collection('discord').aggregate(queries.topFive(req.body.channelID, req.body.Sentiment)).toArray();
        let key = `${req.body.channelID}-${req.body.Sentiment}-${Date.now()}`;
        await storeResult(key, {Sentiment: req.body.Sentiment, type: 0, result: result});
        url = `http://cloud-borrar-1972453943.us-east-1.elb.amazonaws.com/topFive/${key}`;

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
      //  console.log(reqResult);
        users.push(`"${reqResult.username}#${reqResult.discriminator}"`);
        userdata.push(+user.avgScore);
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
    res.header('Content-Type', 'text/html')
    res.type('text/html')
    res.send(require('../public/html/result').topFive(title, users, userdata))
  });

  fastify.post('/userTimeline', async (req, res) => {
    //userId, channelID
    //provides information of a user's emotions per day
    if(!client){
      client = await MongoClient.connect('mongodb://35.153.138.183:27017', {
        useNewUrlParser: true
      });
    }
    let result = {};
    let url = '';
    try {
      result = await client.db('moody').collection('discord').aggregate(queries.userTimeline(req.body.channelID, req.body.userID)).toArray();
      let key = `${req.body.channelID}-${req.body.userID}-${Date.now()}`;
      await storeResult(key, {userID: req.body.userID, type: 1, result: result});
      url = `http://cloud-borrar-1972453943.us-east-1.elb.amazonaws.com/userTimeline/${key}`;

    } catch (e) {
      console.log(e);
    }

    res.send(url);
  });

  fastify.get('/userTimeline/:result', async (req, res) => {
    let dates = [];
    let userdata = [{
        data:[],
        label: "Neutral",
        borderColor: "#3e95cd",
        fill: false
      },
      {
        data:[],
        label: "Negative",
        borderColor: "#8e5ea2",
        fill: false
      },
      {
        data:[],
        label: "Positive",
        borderColor: "#3cba9f",
        fill: false
      },
      {
        data:[],
        label: "Mixed",
        borderColor: "#e8c3b9",
        fill: false
      }];
    let data = [];
    let title;
    try {
      let result = await s3.getObject({Bucket: 'cloud2018final', Key: req.params.result}).promise();
      let jsonResult = JSON.parse(result.Body.toString('utf8'));
      let reqResult = await request({
        method: 'GET',
        uri: `https://discordapp.com/api/v6/users/${jsonResult.userID}`,
        headers: {
          'Authorization': `Bot ${auth.token}`
        },
        json: true
      })
      //  console.log(reqResult);
        title=`"${reqResult.username}#${reqResult.discriminator}"`
        jsonResult.result.forEach(record => {
          dates.push(`"${record._id}"`);
          record.scores.forEach(score => {
            switch (score.sentiment) {
              case "NEGATIVE":
                userdata[1].data.push(score.avgScore);
                break;
              case "POSITIVE":
                userdata[2].data.push(score.avgScore);
                break;
              case "MIXED":
                userdata[3].data.push(score.avgScore);
                break;
              case "NEUTRAL":
                userdata[0].data.push(score.avgScore);
                break;
              default:

            }
          })

        })

        userdata.forEach(ud => {
          data.push(`${JSON.stringify(ud)}`);
        })
        //dates.push(`"${reqResult._id}"`);
        //userdata.push(+user.avgScore);
    } catch (e) {
      console.log(e);
      throw e;
    }
    res.header('Content-Type', 'text/html')
    res.type('text/html')
    res.send(require('../public/html/result').timeline(dates, data, title))
  });

  fastify.post('/userStats', async (req, res) => {
    //userID
    //provides general information of a user overall channels where the bot its listening
    if(!client){
      client = await MongoClient.connect('mongodb://35.153.138.183:27017', {
        useNewUrlParser: true
      });
    }

    let result = {};
    let url = '';
    try {
      result = await client.db('moody').collection('discord').aggregate(queries.userStatsGeneral(req.body.userID)).toArray();
      let key = `${req.body.userID}-userStats-${Date.now()}`;
      await storeResult(key, {Sentiment: req.body.Sentiment, type: 2, result: result});
      url = `http://cloud-borrar-1972453943.us-east-1.elb.amazonaws.com/userStats/${key}`;

    } catch (e) {
      console.log(e);
    }

    res.send(url);
  });

  fastify.get('/userStats/:result', async (req, res) => {
    let user;
    let data = [];
    try {
      let result = await s3.getObject({Bucket: 'cloud2018final', Key: req.params.result}).promise();
      let jsonResult = JSON.parse(result.Body.toString('utf8'));
      let reqResult = await request({
        method: 'GET',
        uri: `https://discordapp.com/api/v6/users/${jsonResult.result[0].userID}`,
        headers: {
          'Authorization': `Bot ${auth.token}`
        },
        json: true
      })
      //  console.log(reqResult);
      user=`"${reqResult.username}#${reqResult.discriminator}"`
      jsonResult.result.forEach(record => {
        switch (record._id) {
          case "NEGATIVE":
            //userdata[2].
            data.push(record.avgScore);
            break;
          case "POSITIVE":
            //userdata[0].
            data.push(record.avgScore);
            break;
          case "MIXED":
          //  userdata[3].
            data.push(record.avgScore);
            break;
          case "NEUTRAL":
            //userdata[1].
            data.push(record.avgScore);
            break;
          default:
        }
      })

        //dates.push(`"${reqResult._id}"`);
        //userdata.push(+user.avgScore);
    } catch (e) {
      console.log(e);
      throw e;
    }
    // userdata.forEach(ud => {
    //   data.push(`${JSON.stringify(ud)}`);
    // })

    res.header('Content-Type', 'text/html')
    res.type('text/html')
    res.send(require('../public/html/result').userStats(user, data));
    console.log(data.toString());
  });

  fastify.post('/userStatsChannel', async (req, res) => {
    //userId, channelID
    //provides general information of a user in the current channel
    if(!client){
      client = await MongoClient.connect('mongodb://35.153.138.183:27017', {
        useNewUrlParser: true
      });
    }

    let result = {};
    let url = '';
    try {
      result = await client.db('moody').collection('discord').aggregate(queries.userStatsChannel(req.body.channelID, req.body.userID)).toArray();
      let key = `${req.body.userID}-userStatsChannel-${Date.now()}`;
      await storeResult(key, {Sentiment: req.body.Sentiment, type: 2, result: result});
      url = `http://cloud-borrar-1972453943.us-east-1.elb.amazonaws.com/userStatsChannel/${key}`;

    } catch (e) {
      console.log(e);
    }

    res.send(url);
  });

  fastify.get('/userStatsChannel/:result', async (req, res) => {
    let user;
    let data = [];
    try {
      let result = await s3.getObject({Bucket: 'cloud2018final', Key: req.params.result}).promise();
      let jsonResult = JSON.parse(result.Body.toString('utf8'));
      let reqResult = await request({
        method: 'GET',
        uri: `https://discordapp.com/api/v6/users/${jsonResult.result[0].userID}`,
        headers: {
          'Authorization': `Bot ${auth.token}`
        },
        json: true
      })
      //  console.log(reqResult);
      user=`"${reqResult.username}#${reqResult.discriminator}"`
      jsonResult.result.forEach(record => {
        switch (record._id) {
          case "NEGATIVE":
            //userdata[2].
            data.push(record.avgScore);
            break;
          case "POSITIVE":
            //userdata[0].
            data.push(record.avgScore);
            break;
          case "MIXED":
          //  userdata[3].
            data.push(record.avgScore);
            break;
          case "NEUTRAL":
            //userdata[1].
            data.push(record.avgScore);
            break;
          default:
        }
      })

        //dates.push(`"${reqResult._id}"`);
        //userdata.push(+user.avgScore);
    } catch (e) {
      console.log(e);
      throw e;
    }
    // userdata.forEach(ud => {
    //   data.push(`${JSON.stringify(ud)}`);
    // })

    res.header('Content-Type', 'text/html')
    res.type('text/html')
    res.send(require('../public/html/result').userStats(user, data));
  });

  next();
}
