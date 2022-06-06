import dotenv from 'dotenv';
dotenv.config();
// import {Canvas, loadImage, toDataURL} from 'skia-canvas';
import skia from 'skia-canvas';
const { Canvas, loadImage, FontLibrary } = skia;
import { fillTextWithTwemoji } from 'skia-canvas-twemoji'

import drawWithRandomBoldWords from './drawWithRandomBoldWords.js';

// var DetectLanguage = require('detectlanguage');
import DetectLanguage from 'detectlanguage';

var detectlanguage = new DetectLanguage(process.env.DETECT_LANG_API_KEY);

// let text = "علاء كنو هزاع انت صحفي هزاع لا علاء هذه حركات الصحفيين اعرفها وكأنه يقول اعلام الهلال الجهلة وتضليلة مكشوف ومعروف .😂";

// detectlanguage.detect(text).then(function(result) {
//   console.log(JSON.stringify(result));
// });

import config from '../config.js';

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import fs from 'fs';

let rand = n => Math.floor(n * Math.random());
const getRandomColor = () => `rgb(${rand(255)}, ${rand(255)}, ${rand(255)})`;
const getRandomColorArray = () => [rand(255), rand(255), rand(255)];
const getRandomColorArrayWithAlpha = () => [rand(255), rand(255), rand(255), rand(255)];
const getRandomColorArrayWithAlphaAndOpacity = () => [rand(255), rand(255), rand(255), rand(255), rand(255)];

// const quoteIconsPos = {
//   firstQuote: {
//     x: 45,
//     y: 25
//   },
//   secondQuote: {
//     x: 540,
//     y: 340
//   }
// } 

const drawTweetQuoteCanvas = async (width, height, { text, name, username, pfp, followers, followings, fontArr, returnFormat, returnType, returnQuality }) => {
  //const height = 500;

  let canvas = new Canvas(width, height);
  const ctx = canvas.getContext('2d');

  //formatting the text
  text = text.replace(/https:\/\/t.co\/\w+/gi,'')

  //font size etup according to text length // max text is 280 so... no worries
  let fontSize;
  if (text.length <= 10) fontSize = 120;
  else if (text.length > 10 && text.length <= 60) fontSize = 80;
  else if (text.length > 60 && text.length <= 100) fontSize = 60;
  else if (text.length > 100 && text.length <= 150) fontSize = 50;
  else if (text.length > 150 && text.length <= 180) fontSize = 45;
  else if (text.length > 180 && text.length <= 210) fontSize = 42;
  else if (text.length > 210 && text.length <= 250) fontSize = 40;
  else if (text.length > 250 && text.length <= 295) fontSize = 35;
  else if (text.length > 295 && text.length <= 310) fontSize = 32;
  else fontSize = 30;
  console.log({
    len: text.length,
    fontSize
  })
  //Loading fonts
  if (fontArr && fontArr.length) FontLibrary.use("Baloobhaijaan", fontArr);

  // Black background
  ctx.fillRect(0, 0, canvas.width, height);

  let pfpwidth = height - 70;
  // shade
  const shade = ctx.createRadialGradient(-200, height / 2 - 60, pfpwidth + 100, -800, height / 2, pfpwidth + 800);
  // shade.addColorStop(0, "pink");
  // shade.addColorStop(0.8, "white");
  // shade.addColorStop(1, "red");
  shade.addColorStop(0, "#00000000");
  // shade.addColorStop(0.01, "#0000001a");
  // shade.addColorStop(0.1, "#0000001f");
  shade.addColorStop(1, "#000000");


  // draw pfp
  ctx.filter = "grayscale(100%)";
  if (pfp) {
    let img = await loadImage(pfp);
    ctx.drawImage(img, 0, 0, pfpwidth, height);
  }

  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, pfpwidth, height);

  //text styles
  ctx.filter = "grayscale(0%)";
  ctx.fillStyle = "#ffffff";
  ctx.font = `${fontSize}px Baloobhaijaan`;
  ctx.textWrap = true;
  ctx.textAlign = "start";

  //text measures
  let tm = ctx.measureText(text, width - height);
  // console.log(tm.lines.length, tm.lines);
  let txtH = tm.lines.length > 1 ? (tm.lines[1].baseline - tm.lines[0].baseline) * tm.lines.length : tm.lines[0].height;
  let exH = 38;
  let txtY = (height / 2) - (txtH / 2) - exH;
  // console.log({
  //   lines: tm.lines.length,
  //   txtY,
  //   calcTxtY: (height / 2) - (txtH / 2)
  // })
  let nameY = txtY + txtH + 10;
  let usernameY = nameY + 50;
  let followY = usernameY + 50;

  // var text = "Hello! How are you?";

  try {
    let langsArr = await detectlanguage.detect(text);
    // console.log(textLangRes)
    // return;
    // let langsArr = await textLangRes.json();
    let lang = langsArr[0].language;
    console.log('arr: ', langsArr)
    console.log('lang: ', lang)
    if (langsArr.find(lang => lang.language === 'ar')) {
      console.log('arabic detected sodrawing plain text')
      ctx.textAlign = "center";
      ctx.direction = 'rtl';
      ctx.font = `${fontSize - text.match(/\n/g)?.length * 2}px Baloobhaijaan`;
      ctx.fillText(text, (height + width) / 2 - 50, txtY, width - height);
    } else {
      console.log('Exec drawWithRandomBoldWords function')
      ctx.direction = 'ltr';
      ctx.save();
      await drawWithRandomBoldWords(ctx, text, height - 150, txtY, {
        totalTextWidth: width - height,
        // totalTextHeight,
        font: 'Baloobhaijaan',
        fontSize: fontSize
      });
      ctx.restore();
    }
  } catch (error) {
    console.error(error);
  }



  // texts
  // console.log(text.length, fontSize);
  // ctx.fillStyle = "red";
  ctx.direction = 'ltr';
  ctx.textAlign = "center";
  ctx.font = "bold 47px Baloobhaijaan";
  ctx.fillStyle = "#ffffffe2"
  // ctx.fillText(name, (height + width) / 2 - 50, nameY, width - height)
  await fillTextWithTwemoji(ctx, name, (height + width) / 2 - 50, nameY);
  ctx.font = "italic 38px Baloobhaijaan";
  ctx.fillStyle = "gray"
  ctx.fillText(`@${username}`, (height + width) / 2 - 50, usernameY, width - height);
  ctx.font = "28px Baloobhaijaan";
  ctx.fillText(`${followers} followers   ${followings} following`, (height + width) / 2 - 50, followY, width - height)

  // username
  // ctx.fillText(username, height / 2, height / 2 - 50);




  // watermark shade
  let waterMarkH = 60;
  const watermarkShade = ctx.createLinearGradient(0, height - (waterMarkH / 2), height, height - (waterMarkH / 2));
  watermarkShade.addColorStop(0, "#000000");
  watermarkShade.addColorStop(0.7, "#00000000");

  ctx.fillStyle = watermarkShade;
  ctx.fillRect(0, height - waterMarkH, height, waterMarkH);

  //watermark
  ctx.font = "italic 38px Baloobhaijaan";
  ctx.fillStyle = "gray"
  ctx.textAlign = "start";
  ctx.textBaseline = "middle";
  ctx.fillText(`Created by @${config.username}`, 20, height - (waterMarkH / 2));



  if (returnFormat === 'dataURL') {
    return canvas.toDataURL(returnType ? returnType : 'image/jpeg', returnQuality ? returnQuality : 1);
  } else if (returnFormat === 'buffer') {
    return canvas.toBuffer(returnType ? returnType : 'image/jpeg', returnQuality ? returnQuality : 1);
  } else {
    return canvas;
  }
}

// 1200 x 630
// let tweetQuote = await drawTweetQuoteCanvas(1200, 630, {
//   // text: 'Lorem, ipsum dolor sit amet a.',
//   text: `علاء كنو هزاع انت صحفي هزاع لا علاء هذه حركات الصحفيين اعرفها وكأنه يقول اعلام الهلال الجهلة وتضليلة مكشوف ومعروف .😂`,
//   name: "Prasant Kumar",
//   username: 'decodeprasant',
//   pfp: 'https://cdn.discordapp.com/avatars/800445583046213663/027359d038895040a33236d17596d98f.png?size=4096',
//   followers: "2.3 M",
//   followings: "254",
//   fontArr: [path.join(__dirname, '../assets/fonts/Baloo_Bhaijaan_2/BalooBhaijaan2-VariableFont_wght.ttf')],
//   returnFormat: 'buffer',
//   returnType: 'image/jpeg',
//   returnQuality: 1
// });
// fs.writeFileSync('./abcd.jpeg', tweetQuote)


export default drawTweetQuoteCanvas;