const AWS = require('aws-sdk');
const authenticateIdToken = require('./authenticateIdToken');

const s3 = new AWS.S3();
const bucketName = 'twitch-emotes';

module.exports.post = async (event, context, callback) => {
  // TODO
  // try {
  //   const body = JSON.parse(event.body);
  //   const {
  //     token,
  //   } = body;
  //   const decoded = await authenticateIdToken(token);
  //   const {
  //     role,
  //     user_id: userId,
  //   } = decoded;
  //   if (role !== 'broadcaster') {
  //     throw new Error('you are not broadcaster. fuck you');
  //   }
  //   const recentKey = `${userId}/recent.json`;

  //   let recent
  //   try {
  //     const data = await s3.getObject({
  //       Bucket: bucketName,
  //       Key: recentKey,
  //     }).promise();
  //     recent = JSON.parse(data.Body);
  //   } catch (err) {
  //     if (err.code !== 'NoSuchKey') {
  //       throw err;
  //     }
  //     recent = {
  //       feeds: [],
  //       nextData: null,
  //     };
  //   }

  //   const {
  //     feeds,
  //   } = recent;
  //   feeds.unshift(content);

  //   await s3.putObject({
  //     Bucket: bucketName,
  //     Key: recentKey,
  //     Body: JSON.stringify(recent),
  //   }).promise();

  //   const response = {
  //     statusCode: 200,
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Credentials": true,
  //     },
  //     body: JSON.stringify({
  //       message: 'Successfully posted',
  //       recent,
  //     }),
  //   };

  //   callback(null, response);
  // }
  // catch (err) {
  //   const response = {
  //     statusCode: 500,
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Credentials": true,
  //     },
  //     body: JSON.stringify(err, Object.getOwnPropertyNames(err)),
  //   };
  //   callback(null, response);
  // }
};