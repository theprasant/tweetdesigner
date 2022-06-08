import {getTweet, getMentions} from './lib/twitter.js';
import drawTweetQuoteCanvas from './lib/canvas.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const OFFSET = 127397
// let txt = "سعودي عاشق لوطنه 🇸🇦"
let emoReg = /[🇦|🇧|🇨|🇩|🇪|🇫|🇬|🇭|🇮|🇯|🇰|🇱|🇲|🇳|🇴|🇵|🇶|🇷|🇸|🇹|🇺|🇻|🇼|🇽|🇾|🇿]+/g;

const __dirname = dirname(fileURLToPath(import.meta.url));

let tweet = await getTweet('1532793217783156736');
// console.log(JSON.stringify(tweet, null, 2));
import fs from 'fs';

const randWIth5 = (c) => {
  c = c/5;
  let txt = '';
  for(let i = 0; i < c; i++){
    txt += `abc${Math.floor(Math.random() * 10)} `
  }
  return txt;
}
// 1200 x 630
let tweetQuote = await drawTweetQuoteCanvas(1200, 630, {
  // text: 'Lorem, ipsum dolor sit amet a.',
  // text: 'صباح الخير',
  // text: randWIth5(295),
  text: tweet.full_text.replace(/^(@\w+\s)+/, ''),
  name: tweet.user.name/*.replace(emoReg, emoreplacer)*/,
  username: 'prasant',
  pfp: 'https://cdn.discordapp.com/avatars/830530156048285716/7650d0c9ae84e6b11edc43028b90e392.png?size=2048',
  followers: "-2.3 M",
  followings: "+254",
  fontArr: [path.join(__dirname, './assets/fonts/Baloo_Bhaijaan_2/BalooBhaijaan2-VariableFont_wght.ttf')],
  returnFormat: 'buffer',
  returnType: 'image/jpeg',
  returnQuality: 1
});
fs.writeFileSync('./abcd.jpeg', tweetQuote)

// let mentions = await getMentions('1455810851168940039', '2022-06-05T12:14:12.421Z');
// console.log(mentions);
// console.log(JSON.stringify(mentions, null, 2));

function getCountryCodeEmoji (cc) {
  return String.fromCodePoint(
    ...cc
      .toUpperCase()
      .split("")
      .map((c) => (c.codePointAt(0) ?? 0) + OFFSET)
    )
  }

function emoreplacer(code){
  let normatTxt = code.replace(/../g, cp => String.fromCharCode(cp.codePointAt(0)-127397) );
  return getCountryCodeEmoji(normatTxt)
}