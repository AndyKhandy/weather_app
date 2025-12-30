import "./style.css";

const API_KEY = "5JKT896CV9G7SN2NK66PCYCW5";
const form = document.querySelector("form");
let location = "Tokyo";
let weatherAPIdata = null;

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const userInput = document.querySelector("input").value.trim();
    location = userInput;
    console.log(location);
    form.reset();
    getAPIData();
});

async function getAPIData()
{
    let url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/next6days?key=${API_KEY}`;

    try {
        let response = await fetch(url);
        if(!response.ok)
        {
            throw new Error("HTTP Request Wrong");
        }

        weatherAPIdata = await response.json();
    } catch (error) {
        console.error("There was an error!: ",error);
    }
}

//weatherAPIData.currentConditions
//weatherAPIData.days ( [0] is today [1] is tmr etc)
//conditions, temp, description, icon