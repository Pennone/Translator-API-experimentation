function preload() {

}

const circle_color = "#d1893b";

const translate_api_endpoint = "https://api.cognitive.microsofttranslator.com";
let translate_api_key = prompt("Enter your API key:");
const translate_version      = "3.0";
const translate_region       = "switzerlandnorth";

let language = "en";
let sentence = "";
let language_to = "fr";

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
  createCanvas(500, 500);

  background("#7ec4c4");

  textAlign(CENTER);

  let div = createDiv('Hello ').size(100, 100);
  div.html('World', true);
  div.position(width/2 - 50, height/2);

  let div2 = createDiv('Hi! ').size(100, 100);
  div2.position(width/2 - 50, height/2 + 50);
  div.mouseClicked(transl);

}

function draw() {

}

function transl() {
  language = prompt("Enter starting language:");
  sentence = prompt("Enter sentence to translate:");
  language_to = prompt("Enter language to translate to:");

  microsoft_translate(sentence, language, language_to).then((data) => {
    const result = data[0]['translations'][0]['text'];
    alert(result);
  });
}
