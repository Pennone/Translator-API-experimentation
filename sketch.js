let myfont;

function preload() {

  myfont = loadFont('./assets/Unbounded-VariableFont_wght.ttf');

}

let listening = false;
let pressing = false;
let count = 0;
let cool = false;
let count_cool = 0;

let button;

const circle_color = "#d1893b";

let testo = "Hold the button!";

const translate_api_endpoint = "https://api.cognitive.microsofttranslator.com";
let translate_api_key = "fabd1ff9c0e94348ab8e9dcbb0c28444";
const translate_version      = "3.0";
const translate_region       = "switzerlandnorth";

let language = prompt("Insert starting language:");
let sentence = "";
let language_to = prompt("Insert language of translation:");

async function microsoft_translate(source_text, source_language, target_language) {
  const endpoint = `${translate_api_endpoint}/translate?api-version=${translate_version}&from=${source_language}&to=${target_language}`; // Constructing the URL to send to
  const data_body = [{'text': source_text}]; // Constructing the data to be sent
  const response = await fetch(endpoint, {
    method: 'POST', // We will use POST to send this data to the end point
    mode: 'cors', // CORS is a security feature that only allows requests to/from the same site, in this case because we're sending data to an external site we will turn it off
    cache: 'no-cache', // We will disable caching so that we will always get the "fresh" response from the server
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': translate_api_key,
      'Ocp-Apim-Subscription-Region': translate_region
    },
    body: JSON.stringify(data_body)
  });
  return response.json(); // parse json response into a javascript object and return
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER);
  textFont(myfont);
  textSize(16);

  button = createImg('./assets/circle.png').size(200, 200);
  button.position(width/2 - 100, height/2.5);
  button.addClass("button");

  button.mousePressed(lis);
  button.touchStarted(lis);

}

function draw() {

  background("#7ec4c4");

  if (testo == "Hold the button!") {
    text(testo, width/2 - random(-1, 1), height/3 - random(-1, 1));
  } else {
    text(testo, width/2, height/3);
  }

  if (listening == true) {
    listening = false;
    sentence = new p5.SpeechRec(language, gotSpeech);
    sentence.start();

  }

  if (pressing == true) {

    count += 0.5;
    button.size(200 + count, 200 + count);
    button.position(width/2 - 100 - count/2, height/2.5 - count/2)

    if (count % 25 == 0) {

      button.size(200, 200);
      button.position(width/2 - 100, height/2.5)
      count = 0;

    }
  } else {

    button.size(200, 200);
    button.position(width/2 - 100, height/2.5)
    count = 0;

  }

  if (cool == true) {

    count_cool ++;

    if (count_cool > 500) {

      count_cool = 0;
      testo = "Hold the button!";
      cool = false;

    }
  }

}

function gotSpeech() {

  //console.log(sentence);
  pressing = false;

  if(sentence.resultValue) {
    transl(sentence.resultString);
    console.log(sentence.resultString);
  }

}

function lis() {

  listening = true;
  pressing = true;

}

function transl(sentence) {

  microsoft_translate(sentence, language, language_to).then((data) => {
    const result = data[0]['translations'][0]['text'];
    testo = result;
  });

  cool = true;
  count_cool = 0;

}

function mouseReleased() {

  if (pressing == true){
    pressing = false;
  }

}

function touchEnded() {

  if (pressing == true){
    pressing = false;
  }

}