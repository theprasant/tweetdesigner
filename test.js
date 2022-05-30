import {getTweet} from './lib/twitter.js';

let tweet = await getTweet('1531339927430090752');
console.log(tweet);