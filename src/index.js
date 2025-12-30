import "./style.css";
import {format, parseISO} from "date-fns";

const API_KEY = "5JKT896CV9G7SN2NK66PCYCW5";
const form = document.querySelector("form");
let location = "Tokyo";
let weatherAPIdata = null;
let weatherAPIdaysData = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = document.querySelector("input").value.trim();
  location = userInput;
  console.log(location);
  form.reset();
  getAPIData().then(displayMainSection);
});

async function getAPIData() {
  let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next6days?key=${API_KEY}`;

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
}

function displayMainSection()
{
    const currentConditionsBox = document.querySelector(".current-conditions-main");

    const currentConditionsData = weatherAPIdata.currentConditions;
    const currentDay = weatherAPIdaysData[0];

    currentConditionsBox.innerHTML = "";

    const title = document.createElement("h1");
    title.id = "location-title";
    title.textContent = location;

    const time = document.createElement("p");
    time.classList.add("time");
    time.textContent = currentConditionsData.datetime.slice(0,5);

    const date = document.createElement("p");
    date.id = "date";
    date.textContent = formatDate(currentDay.datetime);

    const img = document.createElement("img");
    showImage(currentConditionsData.icon, img);

    const temperature = document.createElement("p");
    temperature.id = "temperature";
    temperature.textContent = `${currentConditionsData.temp}°F`;

    const descript = document.createElement("p");
    descript.id = "description";
    descript.textContent = weatherAPIdata.description;

    currentConditionsBox.append(title,time,date,img,temperature,descript)

}

async function showImage(name, img) {
  const imageModule = await import(`./img/${name}.svg`);
  img.src = imageModule.default;
}

function formatDate(dateString){
   return format(parseISO(dateString),"EEEE, MMMM d");
}


//weatherAPIData.currentConditions
//weatherAPIData.days ( [0] is today [1] is tmr etc)
//conditions, temp, description, icon

/*          <h1 id="location-title">London</h1>
          <p class="time">9:41</p>
          <p id="date">2025-12-30</p>
          <img src="img/cloudy.svg">
          <p id="temperature">25.5°F</p>
          <p id="description">Similar temperatures continuing with no rain expected.</p> */