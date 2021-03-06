import AWS = require('aws-sdk');
import fileType from 'file-type';
import encodeImage from './encodeImage';
import encodeVideo from './encodeVideo';
import extractToken from '../auth/extractToken';
import authenticateExtensionToken from '../auth/authenticateExtensionToken';

const s3 = new AWS.S3();

const S3_BUCKET_BEFORE_ENCODE = 'twitch-channel-feed-media-before-encode';
const S3_BUCKET_AFTER_ENCODE = 'twitch-channel-feed-media-after-encode';

export async function post(event: any, _: any, callback: (error: Error, result: any) => void) {
  try {
    const {
      mediaId,
    } = event.pathParameters;
    const token = extractToken(event.headers);
    const decoded = await authenticateExtensionToken(token);
    const {
      role,
      user_id: userId,
    } = decoded;
    if (role !== 'broadcaster') {
      throw new Error('you are not broadcaster. fuck you');
    }
    const key = `${userId}/${mediaId}`;

    const { Body: body } = await s3.getObject({
      Bucket: S3_BUCKET_BEFORE_ENCODE,
      Key: key,
    }).promise();

    const { ext, mime } = fileType(body);

    if (['image', 'video'].every((type) => !mime.startsWith(type))) {
      throw new Error(`Cannot encode media ${mime}`);
    }

    const encodedMedia = mime.startsWith('image/') && ext !== 'gif'
      ? await encodeImage(body)
      : await encodeVideo(body);
    console.log('after encode');
    const encodedMediaMime = fileType(encodedMedia).mime;

    await s3.putObject({
      Bucket: S3_BUCKET_AFTER_ENCODE,
      Key: key,
      Body: encodedMedia,
      ContentType: encodedMediaMime,
    }).promise();

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        url: `https://${S3_BUCKET_AFTER_ENCODE}.s3.amazonaws.com/${key}`,
        mime: encodedMediaMime,
      }),
    };
    callback(null, response);
  } catch (err) {
    console.error(err);
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
}
