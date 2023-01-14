// global variable for api keys
let keys = {};

// make the dates minimum to be today
let startDateInput = document.getElementById("start-date");
let endDateInput = document.getElementById("end-date");
let todayDate = new Date().toISOString();
startDateInput.min = todayDate.substring(0, todayDate.indexOf("T"));
endDateInput.min = todayDate.substring(0, todayDate.indexOf("T"));

// add a click event listener to the submit button
let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", addTravelPlan);

// add a load event to the body
window.addEventListener("load", handleUI);

function handleUI() {
  getAPIKeys("/apiKey");
  getTravelPlans("/getTravelPlan").then((data) => {
    let cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";
    const documentFragment = document.createDocumentFragment();
    for (const plan of data) {
      // create all needed elements
      let cardDiv = document.createElement("div");
      let cardPinImage = document.createElement("img");
      let cardImage = document.createElement("img");
      let cardInfo = document.createElement("div");
      let cardTitle = document.createElement("h2");
      let cardStatus = document.createElement("p");
      let cardweather = document.createElement("div");
      let cardMinTemp = document.createElement("p");
      let cardMaxTemp = document.createElement("p");
      let cardDuration = document.createElement("div");

      // add all needed classes
      cardDiv.classList.add("card");
      cardPinImage.classList.add("card-pin");
      cardImage.classList.add("card-image");
      cardInfo.classList.add("card-info");
      cardTitle.classList.add("card-title");
      cardStatus.classList.add("card-status");
      cardweather.classList.add("card-weather-info");
      cardMinTemp.classList.add("minTemp");
      cardMaxTemp.classList.add("maxTemp");
      cardDuration.classList.add("card-duration");

      // add the revelent class and text for card status
      if (new Date() < new Date(plan.startDate)) {
        cardStatus.classList.add("card-status--not-started");
        cardStatus.innerHTML = "Not Started";
      } else if (new Date() > new Date(plan.endDate)) {
        cardStatus.classList.add("card-status--complete");
        cardStatus.innerHTML = "Complete";
      } else {
        cardStatus.classList.add("card-status--in-progress");
        cardStatus.innerHTML = "In Progress";
      }

      // add pin image
      cardPinImage.src = Client.pinIcon;

      // add image to card image
      if (plan.image == "") {
        cardImage.src =
          "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
      } else {
        cardImage.src = plan.image;
      }

      // add info
      cardTitle.innerHTML = plan.city + ", " + plan.country;
      cardMinTemp.innerHTML = "Min Temp: " + plan.minTemp;
        cardMaxTemp.innerHTML = "Max Temp: " + plan.maxTemp;
        cardDuration.innerHTML = plan.duration +" Days from '"+ plan.startDate + "' To '" + plan.endDate + "'";

      // add the elements to thier parents
      cardInfo.appendChild(cardTitle);
      cardInfo.appendChild(cardStatus);
      cardweather.appendChild(cardMinTemp);
      cardweather.appendChild(cardMaxTemp);
      cardDiv.appendChild(cardPinImage);
      cardDiv.appendChild(cardImage);
      cardDiv.appendChild(cardInfo);
      cardDiv.appendChild(cardweather);
      cardDiv.appendChild(cardDuration);
      documentFragment.appendChild(cardDiv);
    }
    // add all the cards to the card container
    cardContainer.appendChild(documentFragment);
  });
}

function addTravelPlan(event) {
  event.preventDefault();
  let location = document.getElementById("location").value;
  let startDate = document.getElementById("start-date").value;
  let endDate = document.getElementById("end-date").value;
  // validate user input
  if (location.trim() != "" && startDate.trim() != "" && endDate.trim() != "") {
    if (new Date(endDate) < new Date(startDate)) {
      alert("Please make sure that end date is greater than start Date");
    } else {
      let tripDuration = calculateTripDuration(startDate, endDate);

      let tripObject = {
        country: "",
        city: "",
        startDate: startDate,
        endDate: endDate,
        minTemp: "",
        maxTemp: "",
        image: "",
        duration: tripDuration,
      };

      getGeoInfo(location).then((data) => {
        if (data.geonames.length > 0) {
          // get the needed data from the response
          let countryName = data.geonames[0].countryName;
          let countryCode = data.geonames[0].countryCode;
          let city = data.geonames[0].name;
          let lat = data.geonames[0].lat;
          let lng = data.geonames[0].lng;

          // fill the trip object
          tripObject.country = countryName;
          tripObject.city = city;

          getWeatherInfo(lat, lng, countryCode, startDate).then((data) => {
            // get the needed data from the response
            let minTemp = data.app_min_temp;
            let maxTemp = data.app_max_temp;

            // fill the trip object
            tripObject.minTemp = minTemp;
            tripObject.maxTemp = maxTemp;

            getImage(tripObject.city, tripObject.country).then((data) => {
              tripObject.image = data;
              postTravelPlan("/addTravelPlan", tripObject);
              handleUI();
            });
          });
        } else {
          alert("Please enter a valid location");
        }
      });
    }
  } else {
    alert("Please enter all values");
  }
}

// calculate the trip duration
const calculateTripDuration = (startDate, endDate) => {
    let tripDuration = new Date(endDate) - new Date(startDate);
    tripDuration = tripDuration / (1000 * 60 * 60 * 24) + 1;
    return tripDuration;
}

// get the country, lat, and long of the travel location
const getGeoInfo = async (location) => {
  const res = await fetch(
    `http://api.geonames.org/search?name_equals=${location}&username=${keys.geoname_key}&type=json`
  );
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

// get the weather of the travel location
const getWeatherInfo = async (lat, lng, country, date) => {
  const res = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?key=${keys.weather_key}&lat=${lat}&lon=${lng}&country=${country}`
  );
  try {
    const data = await res.json();
    let index = data.data.findIndex((weather) => weather.datetime == date);
    let weatherObject = {};
    if (index != -1) {
      weatherObject = data.data[index];
    } else {
      weatherObject = data.data[data.data.length - 1];
    }
    return weatherObject;
  } catch (error) {
    console.log("error", error);
  }
};

// get the image of the travel location
const getImage = async (city, country) => {
  let searchTerm = "";
  if (city != "") {
    searchTerm = encodeURI(city + ", " + country);
  } else {
    searchTerm = encodeURI(country);
  }
  const res = await fetch(
    `https://pixabay.com/api/?key=${keys.image_key}&q=${searchTerm}&category=places`
  );
  try {
    const data = await res.json();
    let resultUrl = "";
    if (data.total == 0 && city == "") {
      return "";
    } else if (data.total == 0) {
      resultUrl = getImage("", country);
    } else {
      resultUrl = data.hits[0].webformatURL;
    }

    return resultUrl;
  } catch (error) {
    console.log("error", error);
  }
};

// post the travel plan to the server
const postTravelPlan = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log("error", error);
  }
};

// get the travel plans from the server
const getTravelPlans = async (url) => {
  const res = await fetch(url);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

// get the travel plans from the server
const getAPIKeys = async (url) => {
    const res = await fetch(url);
    try {
      const data = await res.json();
      keys = data;
    } catch (error) {
      console.log("error", error);
    }
  };
export { handleUI, addTravelPlan, getGeoInfo, calculateTripDuration };
