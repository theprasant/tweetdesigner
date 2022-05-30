import dotenv from 'dotenv';
dotenv.config();

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// import config from '../config.js';
// console.log(config)

import drawTweetQuoteCanvas from './canvas.js';
import { uploadMediFromBuffer } from './mediaupload.js';

import fetch from 'node-fetch';

import Twit from 'twit';

var T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
  // strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

// T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log(data)
// })

const getTweet = async (tweetId) => {
  let url = `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}&tweet_mode=extended`;
  let res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
    }
  });
  let data = await res.json();
  return data;
}
const getUser = async (userid) => {
  let url = `https://api.twitter.com/2/users/${userid}?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld`;
  let res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
    }
  });
  let data = await res.json();
  return data;
}

const getMentions = async (userid, start_time) => {
  let url;
  try {
    if (start_time) {
      url = `https://api.twitter.com/2/users/${userid}/mentions?start_time=${start_time}`;
    } else {
      url = `https://api.twitter.com/2/users/${userid}/mentions`;
    }
    let response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
      }
    });
    let data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

const replyMentionedTweets = async (mentionsArr, { statusText, statusTextFormatter }) => {
  if ( !mentionsArr || mentionsArr.length == 0) {
    // throw new Error('Invalid parameters');
    return;
  };
  console.log("someone mentioned: from replyMnetionedTweets function")
  // let url;
  for (let mention of mentionsArr) {
    if (!mention.in_reply_to_status_id_str) return;
    try {
      let tweet = await getTweet(mention.in_reply_to_status_id_str);
      let tweetQuoteImageBuffer = await drawTweetQuoteCanvas(1200, 630, {
        text: tweet.full_text.replace(/\n+/g, ' '),
        name: tweet.user.name,
        username: tweet.user.screen_name,
        pfp: tweet.user.profile_image_url_https.replace('_normal', ''),
        followers: abbreviateNumber(tweet.user.followers_count) || tweet.user.followers_count,
        followings: abbreviateNumber(tweet.user.friends_count) || tweet.user.friends_count,
        fontArr: [path.join(__dirname, '../assets/fonts/Baloo_Bhaijaan_2/BalooBhaijaan2-VariableFont_wght.ttf')],
        returnFormat: 'buffer',
        returnType: 'image/png',
        returnQuality: 1
      })

      console.log("canvas created with size: ", Buffer.byteLength(tweetQuoteImageBuffer));

      let mediaType = 'image/png';

      uploadMediFromBuffer(tweetQuoteImageBuffer, mediaType, (media) => {
        // if (err) return console.error(err);
        // console.log(bodyObj);
        console.log("media uploaded: ", media);

        if (statusText) {
          // url = `https://api.twitter.com/1.1/statuses/update.json?status=@${mention.username}%20${statusText}&in_reply_to_status_id=${mention.id}`;
          T.post(`statuses/update`, { status: `@${mention.username} ${statusText}`, in_reply_to_status_id: mention.id, media_ids: media.media_id_string }, function (err, data, response) {
            console.log({ id: data.id_str, text: data.text, in_reply_to_status_id: data.in_reply_to_status_id_str });
          })
        } else if (statusTextFormatter) {
          // url = `https://api.twitter.com/1.1/statuses/update.json?status=@${mention.username}%20${statusTextFormatter(mention)}&in_reply_to_status_id=${mention.id}`;
          T.post('statuses/update', { status: `@${mention.username} ${statusTextFormatter(mention)}`, in_reply_to_status_id: mention.id, media_ids: media.media_id_string }, function (err, data, response) {
            console.log({ id: data.id_str, text: data.text, in_reply_to_status_id: data.in_reply_to_status_id_str });
          })
        } else {
          // url = `https://api.twitter.com/1.1/statuses/update.json?status=@${mention.username}%20${statusText}&in_reply_to_status_id=${mention.id}`;
          T.post(`statuses/update`, { status: `@${mention.username}`, in_reply_to_status_id: mention.id, media_ids: media.media_id_string }, function (err, data, response) {
            console.log({ id: data.id_str, text: data.text, in_reply_to_status_id: data.in_reply_to_status_id_str });
          })
        }
      })
    } catch (error) {
      console.error(error);
    }

  }
  console.log('-------------------');
  // try {
  //   // let url = `https://api.twitter.com/1.1/statuses/update.json?status=@${username}%20${statusText}&in_reply_to_status_id=${mentionsArr[0].id}`;
  //   let response = await fetch(url, {
  //     headers: {
  //       'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
  //     }
  //   });
  //   let data = await response.json();
  //   // console.log(data);
  //   return data;
  // } catch (error) {
  //   console.log(error);
  // }
}

// const getTweet = async (tweetId) => {
//   let url = `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}`;
//   let res = await fetch(url, {
//     headers: {
//       'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
//     }
//   });
//   let data = await res.json();
//   return data;
// }



const getOnlyRepliedMentions = async (mentionsArr, username) => {
  if (!mentionsArr || mentionsArr.length == 0 || !username) return;
  let repliedMentions = [];
  for (let mention of mentionsArr) {
    let tweet = await getTweet(mention.id);
    // console.log(tweet.in_reply_to_status_id_str && tweet.text.includes(username));
    if (tweet.in_reply_to_status_id_str && tweet.full_text.includes(username) && tweet.user.screen_name != username) {
      mention.in_reply_to_status_id_str = tweet.in_reply_to_status_id_str;
      mention.username = tweet.user.screen_name;
      repliedMentions.push(mention);
      // console.log(mention)
    }
  }
  return repliedMentions;
}



export { getUser, getMentions, getOnlyRepliedMentions, getTweet, replyMentionedTweets };


function abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
      var suffixes = ["", "K", "M", "B","T"];
      var suffixNum = Math.floor( (""+value).length/3 );
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
          var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}
