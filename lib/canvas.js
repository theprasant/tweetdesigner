// import {Canvas, loadImage, toDataURL} from 'skia-canvas';
import skia from 'skia-canvas';
const { Canvas, loadImage, FontLibrary } = skia;

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

const drawTweetQuoteCanvas = async (width, height, { text, username, pfp, bgImageURL, fontArr, returnFormat, returnType, returnQuality }) => {
  let bgImage;
  if (bgImageURL) {
    // console.log("yes")
    bgImage = await loadImage(bgImageURL);
    width = bgImage.width;
    height = bgImage.height;
  }

  //imports
  if(fontArr && fontArr.length) FontLibrary.use("Rajdhani", fontArr);

  // console.log({width, height, bgImageWidth: bgImage.width, bgImageHeight: bgImage.height})
  let canvas = new Canvas(width, height),
    ctx = canvas.getContext('2d');

  //vars
  let fontSize;
  if (text.length <= 110) {
    fontSize = 43
  } else if (text.length >= 110 && text.length <= 150) {
    fontSize = 34
  } else if (text.length >= 150 && text.length <= 200) {
    fontSize = 30
  } else { //max length 280
    fontSize = 25
  }

  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
  }
  // ctx.fillStyle = '#fff';
  // ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${fontSize}px Rajdhani`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.textWrap = true;

  ctx.fillText(text, width / 2.5, height / 4 + 20, width - width / 3 - 100);
  ctx.font = `italic 30px Rajdhani`;
  ctx.fillText(`@${username}`, width * (3 / 4) + 50, 280)
  //make a circular background of the pfp
  ctx.fillStyle = "#eee";
  ctx.beginPath();
  ctx.arc(width * (3 / 4) + 50, 150, 110, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
  // To make the pfp circular
  ctx.beginPath();
  ctx.arc(width * (3 / 4) + 50, 150, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();


  if (pfp) {
    let img = await loadImage(pfp);
    ctx.drawImage(img, width * (3 / 4) - 50, 50, 200, 200);
  }

  if (returnFormat === 'dataURL') {
    return canvas.toDataURL(returnType ? returnType : 'image/jpeg', returnQuality ? returnQuality : 1);
  } else if (returnFormat === 'buffer') {
    return canvas.toBuffer(returnType ? returnType : 'image/jpeg', returnQuality ? returnQuality : 1);
  } else {
    return canvas;
  }
}

// let tweetQuote = await drawTweetQuoteCanvas(600, 600, {text: 'Hello World',username: 'decodeprasant', pfp: 'https://cdn.discordapp.com/avatars/745688196440129915/b86d1c4279033b1232a4dd098566d116.png?size=2048', bgImageURL: 'https://i.imgur.com/KJgefa9.png', returnFormat: 'buffer', returnType: 'image/jpeg', returnQuality: 1});
// fs.writeFileSync('./xyz.jpeg', tweetQuote)

export default drawTweetQuoteCanvas;
