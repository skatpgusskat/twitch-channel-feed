const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const Promise = require('bluebird');

const { emoticons } = require('./emotes');
console.log('load finished');

const emoteSetDictionary = {}; // setId: set

emoticons.forEach(emote => {
  const setId = emote.images.emoticon_set

  if (!emoteSetDictionary[setId]) {
    emoteSetDictionary[setId] = [];
  }

  const set = emoteSetDictionary[setId];

  if (!emote.images) {
    console.log(setId);
    console.log(emote);
    return;
  }
  set.push({
    id: emote.id,
    regex: emote.regex,
    url: emote.images.url,
    emoteSetId: setId,
  });
});
console.log('filtering finished');

function uploadData(body, key) {
  return new Promise((resolve, reject) => {
    const params = {
      Body: JSON.stringify(body),
      Bucket: "twitch-emotes",
      Key: key,
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  })
}

let i = 0;
Promise.map(Object.keys(emoteSetDictionary), (setId) => {
  return uploadData(emoteSetDictionary[setId], setId).then(() => {
    i += 1;
    if (i % 1000 === 0) {
      console.log(i);
    }
  });
}, { concurrency: 256 }); // <---- at most 10 http requests at a time


