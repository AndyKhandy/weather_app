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

getAPIData().then(displayMainSection);

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
    temperature.textContent = `${currentConditionsData.temp}°F`;

    const descript = document.createElement("p");
    descript.id = "description";
    descript.textContent = weatherAPIdata.description;

    bottom.append(temperature, descript);

    currentConditionsBox.append(top, img, bottom);

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


//weatherAPIData.currentConditions
//weatherAPIData.days ( [0] is today [1] is tmr etc)
//conditions, temp, description, icon
