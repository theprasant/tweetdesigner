import dotenv from 'dotenv';
dotenv.config();
import { getUser, getMentions, getOnlyRepliedMentions, getTweet, replyMentionedTweets } from './lib/twiter.js';

import fetch from 'node-fetch';
// let username = 'decodeprasant';
// let username = 'learnsjs';
// let username = 'learnsjs';
// let username = 'TheRock';
let userid = '250831586';

// let url = `https://api.twitter.com/2/users/by/username/${username}`;

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

//https://twitter.com/messages/compose?recipient_id=1455810851168940039&welcome_message_id=1530505355792293893
// Consts
let user = await getUser(userid);
console.log(user);