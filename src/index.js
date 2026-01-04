import "./style.css";
import { format, parseISO } from "date-fns";

const API_KEY = "5JKT896CV9G7SN2NK66PCYCW5";
const form = document.querySelector("form");
const changeMeasurementBtn = document.querySelector("#change-measurement");
const loadingScreen = document.querySelector("#loading-screen");
const mainScreen = document.querySelector(".main-content");

let location = "Tokyo";
let weatherAPIdata = null;
let weatherAPIdaysData = null;
let currentConditionsData = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = document.querySelector("input").value.trim();
  location = userInput;
  console.log(location);
  form.reset();
  runSkydex();
});

changeMeasurementBtn.addEventListener("click", () => {
  changeMeasurement();
});

runSkydex();

function runSkydex()
{
  getAPIData()
  .finally(() => {
    setTimeout(() => {
      loadingScreen.classList.remove("loading");
      mainScreen.classList.remove("loading");
    }, Math.floor(Math.random()*2000)+1000);
  })
  .then(displayMainSection)
  .then(displayOtherSection)
  .then(displayForcast);
}

async function getAPIData() {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next6days?unitGroup=us&key=${API_KEY}`;

  loadingScreen.classList.add("loading");
  mainScreen.classList.add("loading");

  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP Request Wrong");
    }

    weatherAPIdata = await response.json();
    console.log(weatherAPIdata);
  } catch (error) {
    console.error("There was an error!: ", error);
  }
  weatherAPIdaysData = weatherAPIdata.days;
  currentConditionsData = weatherAPIdata.currentConditions;
}

const feelsLikeDisplay = document.querySelector("#feels-like-data");

function displayMainSection() {
  const currentConditionsBox = document.querySelector(
    ".current-conditions-main"
  );

  const currentDay = weatherAPIdaysData[0];

  currentConditionsBox.innerHTML = "";

  const top = document.createElement("div");
  top.classList.add("flex");

  const title = document.createElement("h1");
  title.id = "location-title";
  let locationText = location
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase() + word.slice(1);
    });
  title.textContent = locationText.join(" ");

  const date = document.createElement("p");
  date.id = "date";
  date.textContent = formatDate(currentDay.datetime, "date");

  top.append(title, date);

  const img = document.createElement("img");
  showImage(currentConditionsData.icon, img);

  const bottom = document.createElement("div");
  bottom.classList.add("flex");

  const temperature = document.createElement("p");
  temperature.id = "temperature";
  temperature.classList.add("non-pixel", "temp");
  temperature.textContent = `${currentConditionsData.temp} °F`;

  const descript = document.createElement("p");
  descript.id = "description";
  descript.textContent = weatherAPIdata.description;

  bottom.append(temperature, descript);

  currentConditionsBox.append(top, img, bottom);
}

function displayOtherSection() {
  const conditionsDisplay = document.querySelector("#conditions-data");
  const humidityDisplay = document.querySelector("#humidity-data");
  const precipDisplay = document.querySelector("#precip-data");
  const windDisplay = document.querySelector("#wind-data");
  const cloudCoverDisplay = document.querySelector("#cloud-data");

  conditionsDisplay.textContent = `${currentConditionsData.conditions}`;
  humidityDisplay.textContent = `${currentConditionsData.humidity}%`;
  if (
    currentConditionsData.precip == null ||
    currentConditionsData.precip == 0
  ) {
    precipDisplay.textContent = "none";
  } else {
    precipDisplay.textContent = `${currentConditionsData.precip} inches`;
  }

  windDisplay.textContent = `${currentConditionsData.windspeed} mph`;
  cloudCoverDisplay.textContent = `${currentConditionsData.cloudcover}%`;
  feelsLikeDisplay.textContent = `${currentConditionsData.feelslike} °F`;
}

function displayForcast() {
  const forecastContainer = document.querySelector(".cards");
  forecastContainer.innerHTML = "";

  for (let i = 1; i < weatherAPIdaysData.length; i++) {
    let day = weatherAPIdaysData[i];
    const card = document.createElement("div");
    card.classList.add("day-card", "flex");

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("flex", "flex-col", "flex-ali");

    const dayTitle = document.createElement("h2");
    dayTitle.classList.add("day-name");
    dayTitle.textContent = formatDate(day.datetime, "day");

    const dayDate = document.createElement("p");
    dayDate.classList.add("non-pixel", "day-date");
    dayDate.textContent = formatDate(day.datetime, "other");

    dayDiv.append(dayTitle,dayDate);


    const img = document.createElement("img");
    showImage(day.icon, img);

    const temperatureDiv = document.createElement("div");
    temperatureDiv.classList.add("flex", "flex-ali");

    const temperature = document.createElement("p");
    temperature.classList.add("non-pixel", "temp");

    const colder = document.createElement("span");
    colder.classList.add("coldest", "temp", "non-pixel");

    temperature.textContent = `${day.tempmax} °F`;
    colder.textContent = `${day.tempmin} °F`;

    temperatureDiv.append(colder, temperature);

    card.append(dayDiv, img, temperatureDiv);
    forecastContainer.append(card);
  }
}

function changeMeasurement() {
  const temperatureElements = document.querySelectorAll(".temp");
  let convertToC = true;

  if (changeMeasurementBtn.textContent == "°F") {
    convertToC = false;
    changeMeasurementBtn.textContent = "°C";
  } else {
    changeMeasurementBtn.textContent = "°F";
  }

  temperatureElements.forEach((element) => {
    let text = element.textContent;
    let splitText = text.split(" ");
    let temperature = +splitText[0];
    if (convertToC) {
      element.textContent = `${convertToCelcius(temperature)} °C`;
    } else {
      element.textContent = `${convertToFarenheit(temperature)} °F`;
    }
  });
}

async function showImage(name, img) {
  const imageModule = await import(`./img/${name}.svg`);
  img.src = imageModule.default;
}

function formatDate(dateString, specifier) {
  if (specifier == "day") {
    return format(parseISO(dateString), "EEEE");
  } else if (specifier == "date") {
    return format(parseISO(dateString), "EEEE, MMMM d");
  }
  return format(parseISO(dateString), "MMM d");
}

function convertToCelcius(temp) {
  return Math.round(((temp - 32) * 5) / 9);
}

function convertToFarenheit(temp) {
  return Math.round((temp * 9) / 5 + 32);
}

//weatherAPIData.currentConditions
//weatherAPIData.days ( [0] is today [1] is tmr etc)
//conditions, temp, description, icon
