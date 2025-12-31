import "./style.css";
import {format, parseISO} from "date-fns";

const API_KEY = "5JKT896CV9G7SN2NK66PCYCW5";
const form = document.querySelector("form");
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
  getAPIData().then(displayMainSection).then(displayOtherSection);
});

getAPIData().then(displayMainSection).then(displayOtherSection);

async function getAPIData() {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next6days?unitGroup=us&key=${API_KEY}`;

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

function displayMainSection()
{
    const currentConditionsBox = document.querySelector(".current-conditions-main");

    const currentDay = weatherAPIdaysData[0];

    currentConditionsBox.innerHTML = "";

    const top = document.createElement("div");
    top.classList.add("flex");

    const title = document.createElement("h1");
    title.id = "location-title";
    let locationText = location.toLowerCase().split(" ").map((word) => {
        return word[0].toUpperCase() + word.slice(1);
    });
    title.textContent = locationText.join(" ");

    const date = document.createElement("p");
    date.id = "date";
    date.textContent = formatDate(currentDay.datetime, "date");

    top.append(title,date);

    const img = document.createElement("img");
    showImage(currentConditionsData.icon, img);

    const bottom = document.createElement("div");
    bottom.classList.add("flex");
    
    const temperature = document.createElement("p");
    temperature.id = "temperature";
    temperature.textContent = `${currentConditionsData.temp} °F`;

    const descript = document.createElement("p");
    descript.id = "description";
    descript.textContent = weatherAPIdata.description;

    bottom.append(temperature, descript);

    currentConditionsBox.append(top, img, bottom);
}

function displayOtherSection()
{
  const conditionsDisplay = document.querySelector("#conditions-data");
  const humidityDisplay = document.querySelector("#humidity-data");
  const precipDisplay = document.querySelector("#precip-data");
  const windDisplay = document.querySelector("#wind-data");
  const cloudCoverDisplay = document.querySelector("#cloud-data");

  conditionsDisplay.textContent = `${currentConditionsData.conditions}`;
  humidityDisplay.textContent = `${currentConditionsData.humidity}%`;
  if(currentConditionsData.precip == null || currentConditionsData.precip == 0)
  {
    precipDisplay.textContent = "none";
  }
  else{
      precipDisplay.textContent = `${currentConditionsData.precip} inches`;
  }

  windDisplay.textContent = `${currentConditionsData.windspeed} mph`;
  cloudCoverDisplay.textContent = `${currentConditionsData.cloudcover}%`
  feelsLikeDisplay.textContent = `${currentConditionsData.feelslike} °F`

}

async function showImage(name, img) {
  const imageModule = await import(`./img/${name}.svg`);
  img.src = imageModule.default;
}

function formatDate(dateString, specifier){
  if(specifier == "day")
  {
    return format(parseISO(dateString),"EEEE");
  }
  else if(specifier == "date")
  {
     return format(parseISO(dateString),"EEEE, MMMM d");
  }
   return format(parseISO(dateString),"MMMM d");
}

function convertToCelcius(temp)
{
  return (32 - temp) * 5/9;
}

function convertToFarenheit(temp)
{
  return (temp * 9/5) + 32;
}


//weatherAPIData.currentConditions
//weatherAPIData.days ( [0] is today [1] is tmr etc)
//conditions, temp, description, icon
