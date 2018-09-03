const express = require('express');
const bodyParser = require('body-parser');

const s3Router = require('./src/routes/s3Router');

//Initialize required variables
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/',s3Router);


app.listen(port, err => {
  console.log('running on server on port: ' + port);
});
