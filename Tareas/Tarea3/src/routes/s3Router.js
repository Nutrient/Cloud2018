const express = require('express');
const fileupload = require('express-fileupload');
const stream = require('stream');
const s3Controller = require('../controllers/s3Controller');

const s3Router = express.Router();
s3Router.use(fileupload())

let controller = new s3Controller();

s3Router.route('/')
  .get((req, res) => {
    controller.listBuckets().then(data => {
      res.send(data);
    }).catch(err => {
      res.send({});
    })
  })
  .post((req, res) => {
    controller.createBucket(req.body).then(data => {
      res.send(data);
    }).catch(err => {
      res.send(err);
    })
  })

s3Router.route('/:bucketName/:objKey')
  .get((req, res) => {
    controller.getObject({
      Bucket: req.params.bucketName,
      Key: req.params.objKey
    }).then(data => {
      let readStream = new stream.PassThrough();
      res.attachment(req.params.objKey);
      res.setHeader('Content-type', data.ContentType);
      readStream.end(Buffer.from(data.Body));
      readStream.pipe(res);

    }).catch(err => {
      res.send(err);
    })
  })

s3Router.route('/:bucketName')
  .get((req, res) => {
    controller.listObjects(req.params.bucketName).then(data => {
      res.send(data);
    }).catch(err => {
      res.send({});
    })
  })
  .post((req, res) => {
    controller.putObject({
      Bucket: req.params.bucketName,
      Body: req.files.Body.data,
      ContentType: req.files.Body.mimetype,
      ...req.body
    }).then(data => {
      res.send(data);
    }).catch(err => {
      res.send(err);
    })
  })



module.exports = s3Router;
