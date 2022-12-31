const dotenv = require('dotenv');
dotenv.config();

var path = require('path')
const express = require('express')

/*var api = {
    application_key: process.env.API_KEY
  };*/

const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

/*app.get('/apiKey', function (req, res) {
    res.send(api)
})*/