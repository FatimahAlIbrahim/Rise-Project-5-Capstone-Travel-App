travelPlan = [];

const dotenv = require("dotenv");
dotenv.config();

var path = require("path");
const express = require("express");

/*var api = {
    application_key: process.env.API_KEY
  };*/

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

app.use(express.static("dist"));

app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
  console.log("Example app listening on port 8080!");
});

/*app.get('/apiKey', function (req, res) {
    res.send(api)
})*/

// Get routes
app.get("/getTravelPlan", (req, res) => {
  console.log("get travel plan entered");
  travelPlan.sort(sortByDate);
  res.send(travelPlan);
});

// Post routes
app.post("/addTravelPlan", (req, res) => {
  console.log(req.body);
  console.log("add travel plan entered");

  travelPlan.push(req.body);
});

// comparison function to sort the travel plan array
const sortByDate = (a, b) => {
  if (new Date(a.startDate) < new Date(b.startDate)) {
    return 1;
  }
  else if (new Date(a.startDate) > new Date(b.startDate)) {
    return -1;
  }
  else {
    if (new Date(a.endDate) < new Date(b.endDate)) {
        return 1;
      }
      else if (new Date(a.endDate) > new Date(b.endDate)) {
        return -1;
      }
      else {
        return 0;
      }
    
  }
  
};
