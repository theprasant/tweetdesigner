import {getTweet} from './lib/twitter.js';

let tweet = await getTweet('1532150777568972800');
console.log(JSON.stringify(tweet, null, 2));