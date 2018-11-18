const fastify = require('fastify')();
const AWS = require('aws-sdk');
const MongoClient = require('mongodb').MongoClient;

const comprehend = new AWS.Comprehend({region: 'us-east-1'});
const translator = new AWS.Translate({region: 'us-east-1'});
const s3 = new AWS.S3({region: 'us-east-1'});

let client = undefined;

const translate = async (text, lan = 'en') => {
  let params = {
    Text: text,
    SourceLanguageCode: 'auto', /* required */
    TargetLanguageCode: lan,
  };

  try {
    let result = await translator.translateText(params).promise();
    return result.TranslatedText;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

const getSentiment = async (text, lan = 'en') => {
    let params = {
      LanguageCode: lan, /* required */
      Text: text
    };

    try {
      let result = await comprehend.detectSentiment(params).promise();

      let sentiment = {
        sentiment: result.Sentiment,
        score: Math.max(...[result.SentimentScore.Positive, result.SentimentScore.Negative, result.SentimentScore.Neutral, result.SentimentScore.Mixed ])
      };

      return sentiment;
    } catch (e) {
      console.log(e);
      throw e;
    }
}

const storeResult = async (newEntry) => {
  try {
    if(!client){
      client = await MongoClient.connect('mongodb://localhost:27017', {
        useNewUrlParser: true
      });
    }
    let result = await client.db('moody').collection('discord').insertOne(newEntry);
  } catch (e) {
    throw e;
  }
}

// Declare a route
fastify.post('/', async (request, reply) => {
  if(request.body.message && request.body.message !== '')
    try {
      let translateResult = await translate(request.body.message);
      let sentimentResult = await getSentiment(translateResult);

      let entry = {
        user: request.body.user,
        userID: request.body.userID,
        channelID: request.body.channelID,
        originalMsg: request.body.message,
        translatedMsg: translateResult,
        ...sentimentResult
      };

      await storeResult(entry);

      return { result: sentimentResult};
    } catch (e) {
      console.log(e);
      return {err: 'invalid request'};
    }
  else {
    return {err: 'missing parameters'};
  }


})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(5000);
    console.log(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    console.log(err);
  }
}
start();
