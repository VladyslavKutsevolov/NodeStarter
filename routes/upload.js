const AWS = require('aws-sdk');
const keys = require('../config/keys');
const id = require('uuid/v1');

const s3 = new AWS.S3({
  region: 'us-east-2',
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: 'v4'
});

module.exports = app => {
  app.get('/api/upload', async (req, res) => {
    const key = `${req.user.id}/${id()}.jpeg`;

    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'blogster1',
        Key: key,
        ContentType: 'image/jpeg'
      },
      (err, url) => res.send({ key, url })
    );
  });
};
