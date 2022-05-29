import dotenv from 'dotenv';
dotenv.config();
import Twit from 'twit';
import drawTweetQuoteCanvas from './canvas.js';

var twit = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
  // strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

// let mediaFileSizeBytes = fs.statSync('./assets/images/demopfp/pfp.png').size;

const uploadMediFromBuffer = async (buffer, mediaType, cb) => {

  let mediaFileSizeBytes = Buffer.byteLength(buffer);
  twit.post('media/upload', {
    'command': 'INIT',
    'media_type': mediaType,
    'total_bytes': mediaFileSizeBytes
  }, function(err, bodyObj, resp) {
    if(err) throw err;
    appendMedia(bodyObj.media_id_string, 0, finalizeMedia);
  })

  const appendMedia = function (mediaIdStr, segmentIndex, callback) {
    // console.log('mediaIdStr append: ', mediaIdStr);
    twit.post('media/upload', {
      'command': 'APPEND',
      'media_id': mediaIdStr,
      'segment_index': segmentIndex,
      'media': buffer.toString('base64'),
    }, (err, bodyObj, resp) => {
      if(err) throw err;
      callback(mediaIdStr, resp);
    })
  }

  const finalizeMedia = function (mediaIdStr, resp) {
    // return console.log('mediaIdStr final: ', bodyObj.media_id_string);
    // if(err) throw err;
    twit.post('media/upload', {
      'command': 'FINALIZE',
      'media_id': mediaIdStr
    }, (err, bodyObj, resp) => {
      if(err) throw err;
      cb(bodyObj);
      // return bodyObj;
    })
  }

}

export {uploadMediFromBuffer};

/**
 * Example: below
 */

//How to call the function:

// let tweetQuote = await drawTweetQuoteCanvas(600, 600, { text: 'Hello World and yeah lol', username: 'decodeprasant', pfp: 'https://cdn.discordapp.com/avatars/745688196440129915/b86d1c4279033b1232a4dd098566d116.png?size=2048', bgImageURL: 'https://i.imgur.com/KJgefa9.png', returnFormat: 'buffer', returnType: 'image/jpeg', returnQuality: 0.5 });
// let mediaType = 'image/png';
// let mediaFileSizeBytes = Buffer.byteLength(tweetQuote);


// let media = await uploadMediFromBuffer(tweetQuote, mediaType, (bodyObj) => {
//   // if(err) return console.error(err);
//   // console.log("inside cb", bodyObj);
// } )

// console.log('media is:', media);




//Bare form:

// twit.post('media/upload', {
//   'command': 'INIT',
//   'media_type': mediaType,
//   'total_bytes': mediaFileSizeBytes
// }, function (err, bodyObj, resp) {
//   // assert(!err, err);
//   var mediaIdStr = bodyObj.media_id_string;

//   // var isStreamingFile = true;
//   var isUploading = false;
//   var segmentIndex = 0;
//   // var fStream = fs.createReadStream(mediaFilePath, { highWaterMark: 5 * 1024 * 1024 });

//   twit.post('media/upload', {
//     'command': 'APPEND',
//     'media_id': mediaIdStr,
//     'segment_index': segmentIndex,
//     'media': tweetQuote.toString('base64'),
//   }, function (err, bodyObj, resp) {
//     // assert(!err, err);
//     isUploading = false;

//     // if (!isStreamingFile) {
//     _finalizeMedia(mediaIdStr, _checkFinalizeResp);
//     // }
//   });

//   var _finalizeMedia = function (mediaIdStr, cb) {
//     twit.post('media/upload', {
//       'command': 'FINALIZE',
//       'media_id': mediaIdStr
//     }, cb)
//   }

//   var _checkFinalizeResp = function (err, bodyObj, resp) {
//     console.log(bodyObj)
//     // exports.checkUploadMedia(err, bodyObj, resp)
//     // done();
//   }


// });
