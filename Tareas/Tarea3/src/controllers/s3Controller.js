const AWS = require('aws-sdk');
const s3 = new AWS.S3();


class s3Controller {
  listBuckets() {
    return s3.listBuckets({}).promise();
  }

  listObjects(bucketName){
    return s3.listObjects({Bucket:bucketName}).promise();
  }

  putObject(objectData){
    return s3.putObject(objectData).promise();
  }

  createBucket(bucketData){
    return s3.createBucket(bucketData).promise();
  }

  getObject(objectData){
    return s3.getObject(objectData).promise();
  }

}

module.exports = s3Controller;
