// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// import fetch from 'node-fetch';
// require('dotenv').config();
//import dotenv
// import dotenv from 'dotenv';
// dotenv.config();

import { getMentions, getOnlyRepliedMentions, getTweet, replyMentionedTweets } from './lib/twitter.js';

// let username = 'decodeprasant';
// let userid = '1247490702931456001';
let username = 'learnsjs';
let userid = '1455810851168940039';
let lastMentionDetectionTime = new Date().toISOString();
// let lastMentionDetectionTime = new Date(2022, 4, 27).toISOString();

let mentionDetectionInterval = setInterval(async () => {
  try {
    // console.log(lastMentionDetectionTime);
    let allMentions = await getMentions(userid, lastMentionDetectionTime);
    // console.log(allMentions);
    let mentionsInReply = await getOnlyRepliedMentions(allMentions.data, username);
    if(mentionsInReply && mentionsInReply.length) console.log(mentionsInReply);
    // mentionsInReply.forEach(mention => {
    //   // console.log(mention);
    //   let tweet = await getTweet(mention.in_reply_to_status_id_str);


    // });

    // console.log("--------------------------------")
    if (mentionsInReply && mentionsInReply.length > 0) {
      console.log("someone mentioned me: from index.js");
      // return console.log('0th reply: ',mentionsInReply[0]);
      // return console.log('time: ',mentionsInReply[0].created_at);
      let lastMentionTimeInMilisec = new Date((await getTweet(mentionsInReply[0].id)).created_at).getTime() + 1000;
      lastMentionDetectionTime = new Date(lastMentionTimeInMilisec).toISOString();
      // let lastMention = allMentions[0];
      // console.log(mentionsInReply);

      // // let tweet = await getTweet(lastMention.in_reply_to_status_id_str);
      // let statusText = `@${tweet.user.screen_name} ${tweet.text}`;
      await replyMentionedTweets(mentionsInReply, {statusText: null, statusTextFormatter:null});
      console.log("-----------Replied------------");
    }
  } catch (error) {
    console.error(error);
  }
}, 5_000);

console.log("Running...");

// let allMentions = await getMentions(userid);
// let tweet = await getTweet('1530195932163100672');
// console.log(tweet);
// let allMentions = await getMentions(userid, '2022-05-27T00:00:00.000Z');
// // console.log(allMentions)
// allMentions.data.forEach(mention => {
//   console.log(mention.text);
// })
















// const getMentions = async () => {
//   try {
//     let url = `https://api.twitter.com/1.1/statuses/mentions_timeline.json`;
//     let response = await fetch(url, {
//       headers: {
//         'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
//       }
//     });
//     let data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// }





// let res = await fetch(url, {
//   headers: {
//     'Accept': '*/*',
//     'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
//   }
// });
// if(res.status == 200) {
//   let data = await res.json();
//   console.log(data);
// }else{
//   let data = await res.json();
//   console.log(res.status);
//   console.log(data);
// }


//Consts
// let url = `https://api.twitter.com/2/users/by/username/${username}`;
// let url = `https://api.twitter.com/2/users/${userid}/mentions`;
