let circle;
let myfont;

function preload() {

  myfont = loadFont('./assets/Unbounded-VariableFont_wght.ttf');
  circle = loadImage('./assets/circle.png');

}

let listening = false;

const circle_color = "#d1893b";

let testo = "Hold the button!";

const translate_api_endpoint = "https://api.cognitive.microsofttranslator.com";
let translate_api_key = "fabd1ff9c0e94348ab8e9dcbb0c28444";
const translate_version      = "3.0";
const translate_region       = "switzerlandnorth";

let language = "it";
let sentence = "";
let language_to = "en";

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

  let button = createImg('./assets/circle.png').size(200, 200);
  button.position(width/2 - 100, height/2.5);

  button.mousePressed(lis);

}

function draw() {

  background("#7ec4c4");

  text(testo, width/2, height/3);

  if (listening == true) {
    listening = false;
    sentence = new p5.SpeechRec(language, gotSpeech);
    sentence.start();
  }

}

function gotSpeech() {

  //console.log(sentence);

  if(sentence.resultValue) {
    transl(sentence.resultString);
  }

}

function lis() {

  listening = true;

}

function transl(sentence) {

  microsoft_translate(sentence, language, language_to).then((data) => {
    const result = data[0]['translations'][0]['text'];
    testo = result;
  });

}

function mouseReleased() {

  if (listening == true){
    listening = false;
  }

}