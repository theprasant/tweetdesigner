import {getTweet} from './lib/twiter.js';

let tweet = await getTweet('1530025624001290240');
console.log(tweet);