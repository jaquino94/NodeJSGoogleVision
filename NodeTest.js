const express = require('express');
const multer = require('multer');

const app = express();
const upload = multer({dest: __dirname + '/images'});


/*app.use(express.static(path.join(__dirname, 'views')));*/
app.set('view engine', 'ejs');

async function analyze(req, res) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  if ( req.file ) {
      const [result] = await client.labelDetection('./images/' + req.file.filename);
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
        analyze(req,res);
        return;
    }
    res.render('ImageInsert', {
        labels: labels,
    });

});

app.listen(3000, () => {
  console.log('LISTENING ON PORT 3000');
});
