import {getTweet} from './lib/twiter.js';

let tweet = await getTweet('1530580531296931842');
console.log(tweet);