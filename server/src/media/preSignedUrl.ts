import AWS = require('aws-sdk');
import uuid from 'uuid/v4';
import extractToken from '../auth/extractToken';
import authenticateExtensionToken from '../auth/authenticateExtensionToken';

const s3 = new AWS.S3({
  region: 'ap-northeast-2',
});
const MB = 1024 * 1024;

module.exports.get = async (event: any, _: any, callback: (error: Error, result: any) => void) => {
  try {
    const token = extractToken(event.headers);
    const decoded = await authenticateExtensionToken(token);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }

    const mediaId = uuid();
    const key = `${userId}/${mediaId}`;

    const params = {
      Bucket: 'twitch-channel-feed-media-before-encode',
      Conditions: [
        ['content-length-range', 0, 40 * MB],
        {
          key,
        },
      ],
    };

    const {
      url,
      fields,
    } = await new Promise<AWS.S3.PresignedPost>((resolve, reject) => {
      s3.createPresignedPost(params, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        url,
        fields,
        key,
        mediaId,
      }),
    };
    callback(null, response);
  } catch (err) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    };
    callback(null, response);
  }
};
