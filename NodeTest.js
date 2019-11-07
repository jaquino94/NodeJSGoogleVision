const express = require('express');

const app = express();

async function quickstart() {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.labelDetection('./testimage.jpg');
  console.log("ANALYZING IMAGE");
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}


app.listen(3000, () => {
  quickstart();
  console.log('LISTENING ON PORT 3000');
});
