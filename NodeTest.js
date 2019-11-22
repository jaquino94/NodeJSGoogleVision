const {format} = require('util');
const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer();

const vision = require('@google-cloud/vision');
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);


/*app.use(express.static(path.join(__dirname, 'views')));*/
app.set('view engine', 'ejs');

async function analyze(req, res) {
  // Imports the Google Cloud client library

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  if ( req.file ) {

      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
          resumable: false,
      });

      blobStream.on('error', err => {
          next(err);
      });

      let publicUrl = '';
      blobStream.on('finish', () => {
          // The public URL can be used to directly access the file via HTTP.
           publicUrl = format(
              `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
      });

      blobStream.end(req.file.buffer);

      const [result] = await client.labelDetection('gs://nodevision.appspot.com/' + req.file.originalname);
      console.log("ANALYZING IMAGE");
      const labels = result.labelAnnotations;
      console.log('Labels:');
      labels.forEach(label => console.log(label.description));

      res.render('ImageInsert', {
          labels: labels,
      });
  }
}

app.get('/', function(req, res) {
    let labels = null;
    res.render('ImageInsert', {
        labels: labels,
    });
});

app.get('/HowTo', function(req, res) {
    let labels = null;
    res.render('HowTo');
});

app.post('/upload', upload.single('pic'), function(req, res) {
    let labels = null;
    if ( req.file ) {
        analyze(req, res).then(r => {});
        return;
    }
    res.render('ImageInsert', {
        labels: labels,
    });

});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});
