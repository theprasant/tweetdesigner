import skia from 'skia-canvas';
const { Canvas, loadImage, FontLibrary } = skia;
import fs from 'fs';

let canvas = new Canvas(1200, 630);
let ctx = canvas.getContext('2d');

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const startX = canvas.width / 2 - 70;
const totalTextWidth = canvas.width / 2 - 60;
const totalTextHeight = canvas.height - 50;
const startY = 25;

ctx.strokeStyle = 'red';

ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.stroke();
ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.stroke();
// ctx.moveTo(startX, startY);
ctx.strokeRect(startX, startY, totalTextWidth, totalTextHeight);

let txt = "علاء كنو هزاع انت صحفي هزاع لا علاء هذه حركات الصحفيين اعرفها وكأنه يقول اعلام الهلال الجهلة وتضليلة مكشوف ومعروف .😂";

// ctx.direction = 'rtl';

const drawWithRandomBoldWords = (ctx, txt, startX, startY, args) => {
  console.log('startX: ', startX)
  console.log(args)
  let { totalTextWidth, totalTextHeight, font, fontSize } = args;
  let allWords = txt.split(' ');
  let boldWords = [];
  // allWords.length/5;
  for (let i = 0; i < Math.floor(allWords.length / 5); i++) {
    let randNum = Math.floor(Math.random() * 5);
    boldWords.push(allWords[i * 5 + randNum]);
  }
  console.log(boldWords);
  // ctx.textAlign = "center";
  ctx.textWrap = true;
  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize}px ${font}`;
  // txt = txt.replace(/\n/g, '\\n');
  let mt = ctx.measureText(txt, totalTextWidth);
  let lines = mt.lines;
  // console.log(JSON.stringify(lines, null, 2));
  lines.forEach((e, i) => {
    // console.log("t:",txt.substring(e.startIndex, e.endIndex + 1), '\n');
    let curText = txt.substring(e.startIndex, e.endIndex + 1);
    // console.log('line: ', curText);
    let curTxtWidth = ctx.measureText(curText).width;
    let prevWordWidth = (totalTextWidth - curTxtWidth) / 2 + startX;
    let words = curText.split(' ');
    // console.log('words: ', words)
    let dWords = words.filter(w => {
      w = w.replace(/^ +$/, '')
      return w != ''
    })
    if ((/^\n+/).test(dWords[0])) {
      // words = ['\n']
      return;
    }
    // console.log('words after: ', words)
    words.forEach((word, j) => {
      let wordWidth = ctx.measureText(word).width;
      let wordX = prevWordWidth + 100;
      let wordY = fontSize * i + startY;
      if (boldWords.includes(word)) {
        ctx.font = `bold ${fontSize}px ${font}`;
        prevWordWidth += wordWidth + 13;
      } else {
        ctx.font = `${fontSize}px ${font}`;
        prevWordWidth += wordWidth + 8;
      }
      // console.log('font: ', ctx.font)
      ctx.fillText(word, wordX, wordY);
    })
  })
  // return canvas.toBuffer('image/jpeg', 1);
}

export default drawWithRandomBoldWords;

// let cv = await drawWithRandomBoldWords(ctx, txt, startX, startY, {
//   totalTextWidth,
//   // totalTextHeight,
//   font: 'serif',
//   fontSize: 30
// });
// fs.writeFileSync('./nc2.jpeg', cv)
// console.log(cv);


// let cv = await canvas.toBuffer('image/jpeg', 1);





// let allWords = txt.split(' ');
// let boldWords = [];
// // allWords.length/5;
// for(let i = 0; i < Math.floor(allWords.length/5); i++) {
//   let randNum = Math.floor(Math.random() * 5);
//   boldWords.push(allWords[i * 5 + randNum]);
// }
// console.log(boldWords);
// // ctx.textAlign = "center";
// ctx.textWrap = true;
// ctx.fillStyle = "#fff";
// ctx.font = "30px serif";

// let mt = ctx.measureText(txt, totalTextWidth);
// let lines = mt.lines;
// // console.log(JSON.stringify(lines, null, 2));
// lines.forEach((e,i) => {
//   // console.log("t:",txt.substring(e.startIndex, e.endIndex + 1), '\n');
//   let curText = txt.substring(e.startIndex, e.endIndex + 1);
//   let curTxtWidth = ctx.measureText(curText).width;
//   let prevWordWidth = (totalTextWidth - curTxtWidth)/2 + startX;
//   let words = curText.split(' ');
//   words.forEach((word, j) => {
//     let wordWidth = ctx.measureText(word).width;
//     let wordX = prevWordWidth + 100;
//     let wordY = 40 * i + 50;
//     if(boldWords.includes(word)) {
//       ctx.font = "bold 30px serif";
//       prevWordWidth += wordWidth+13;
//     }else{
//       ctx.font = "30px serif";
//       prevWordWidth += wordWidth+10;
//     }
//     ctx.fillText(word, wordX, wordY);
//   })
// })

// let spaceIndex = 0;
// let actualLines = [];
// lines.forEach((e,i) => {
//   let curText = txt.substring(spaceIndex, e.endIndex + 1);
//   if(i >= lines.length - 1)  {
//     actualLines.push(curText);
//     return;
//   }
//   let nextText = txt.substring(e.endIndex + 1, lines[i+1].endIndex + 2);
//   if(!nextText.startsWith(' ')){
//     spaceIndex = curText.lastIndexOf(' ');
//     curText = curText.substring(e.startIndex, spaceIndex);
//     actualLines.push(curText);
//     // nextText = nextText.substring(spaceIndex, );
//   }
// })
// console.log(actualLines);
// console.log(JSON.stringify(actualLines, null, 2));

//-----temp--------
// draw first text
// var text = '99%';
// ctx.font = 'bold 12pt Courier';
// ctx.fillText(text, 50, 50);

// // measure text
// var textWidth = ctx.measureText(text).width;

// // draw second text
// ctx.font = 'normal 12pt Courier';
// ctx.fillText(' invisible', 50 + textWidth, 50);
//-----temp--------


//return mt
// console.log('custom: ', buildFont('Sans-Serif', 30, 'b'));
