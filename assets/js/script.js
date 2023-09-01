// url="http://api.weatherapi.com/v1/current.json?key=2f2be9434c73401d8a0153126232008&q=Madurai&aqi=yes";
let KEY="2f2be9434c73401d8a0153126232008";
let city="";

var degreeSymbol = "\u00B0";
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

area=document.querySelector(".Area");
tempC=document.querySelector(".Temp");
des=document.querySelector(".Description");
high_low=document.querySelector(".high-low");
humidity=document.querySelector(".Humidity");
date=document.querySelector(".date");
async function fetchdata(baseUrl){
	const response= await fetch(baseUrl);
	const data=await response.json();
	// console.log(data);
	return await data;
}

function loadcurrentweather (data){
	tempC.innerHTML=formatTemp(data['current']['temp_c']);
	area.innerHTML=data['location']['name'];
	des.innerHTML=data['current']['condition']['text'];
	date.innerHTML=data['location']['localtime'].split(" ")[0];
	getTimeOfDay(data['location']['localtime'].split(" ")[1].split(":")[0]);
	high_low.innerHTML="H:"+formatTemp(data['forecast']['forecastday'][0]['day']['mintemp_c'])+"  L:"+formatTemp(data['forecast']['forecastday'][0]['day']['maxtemp_c']);

}

function getTimeOfDay(currentHour) {
    const body = document.body;
	while (!body.classList.length &&body.classList.length > 0) {
    	body.classList.remove(body.classList.item(0));
	}
	console.log(`${currentHour}, currentHour`);
    if (currentHour >= 6 && currentHour < 12) {
    	body.classList.add("day");
		document.querySelector(".searchcity").style.borderBottomColor = 'black';    	
    } else if (currentHour >= 12 && currentHour < 18) {
        body.classList.add("day");
    } else if (currentHour >= 18 && currentHour < 24) {
        body.classList.add("night");
        document.querySelector(".searchcity").style.borderBottomColor = 'white';
    } else {
        body.classList.add("night");
    }
}

formatTemp=(temp)=>{
	return temp+degreeSymbol;
}

function five_day_forecast(data){
	let five_day_forecast_obj=data['forecast']['forecastday'];	
	// console.log(`The day: ${five_day_forecast_obj}`);
	create_five_day_forecast(five_day_forecast_obj);
}

function create_five_day_forecast(forecastobj){
	let container=document.querySelector('.five_day_forecast_container');
	container.innerHTML="";
	createTitle();
	for(dayObj in forecastobj){
		const dayOfWeek = new Date(forecastobj[dayObj]['date']).getDay();
		let dayName = daysOfWeek[dayOfWeek];
		let logo=forecastobj[dayObj]['day']['condition']['icon'];
		let min=forecastobj[dayObj]['day']['mintemp_c'];
		let max=forecastobj[dayObj]['day']['maxtemp_c'];
		let nodedayName=createNode(dayName);
		let nodelogo=createimg(logo);
		let nodemin=createNode(formatTemp(min));
		let nodemax=createNode(formatTemp(max));
		wrapper(nodedayName,nodelogo,nodemin,nodemax);
	}
}

function createTitle(){
	let day=document.createElement('h5');
	day.Id="title";
	day.classList.add('five_day_forecast_item');
	day.textContent="Day";
	let climate=document.createElement('h5');
	climate.classList.add('five_day_forecast_item');
	climate.textContent="Climate";
	let MinTemp=document.createElement('h5');
	MinTemp.classList.add('five_day_forecast_item');
	MinTemp.textContent="Min";
	let MaxTemp=document.createElement('h5');
	MaxTemp.classList.add('five_day_forecast_item');
	MaxTemp.textContent="Max";
	wrapper(day,climate,MinTemp,MaxTemp);

}

function createNode(value){
	const Node = document.createElement('span');
	Node.classList.add('five_day_forecast_item');
	Node.textContent = value;
	return Node;
}

function createimg(value){
	const Node = document.createElement('img');
	Node.classList.add('five_day_forecast_item');
	Node.src = "http:"+value;
	// console.log(value);
	return Node;
}

function wrapper(day,logo,min,max){
	let wrapper=document.createElement('div');
	wrapper.id="five_day_forecast_wrapper";
	wrapper.appendChild(day);
	wrapper.appendChild(logo);
	wrapper.appendChild(min);
	wrapper.appendChild(max);
	let container=document.querySelector('.five_day_forecast_container');
	container.appendChild(wrapper);

}

function hourly_forecast(data){
	let container=document.querySelector('.Hourly_forecast_container');
	container.innerHTML="";
	let hourly_forecast_obj=data['forecast']['forecastday'][0]['hour'];

	for(hourly_obj in hourly_forecast_obj){
		let time=hourly_forecast_obj[hourly_obj]['time'].split(" ")[1];
		// console.log(time);
		let displayhour=hourdata(time,data);
		if (displayhour) {	
			const [hour, minute] = time.split(':');
			let Ptime=parseInt(hour);
			if(Ptime>12){
				Ptime=Ptime-12;
				Ptime=Ptime+"PM";
			}
			else
				Ptime=Ptime+"AM";
			// console.log(Ptime);
			let icon=hourly_forecast_obj[hourly_obj]['condition']['icon'];
			let temp=hourly_forecast_obj[hourly_obj]['temp_c'];
			// console.log(`icon ${icon} temp ${temp}`);
			createHourData(Ptime,icon,temp);
		} 
	}
}
function createHourData(Ptime,icon,temp){
	let container=document.querySelector('.Hourly_forecast_container');
	let wrapper=document.createElement('div');
	wrapper.id="Hourly_forecast_wrapper";
	wrapper.innerHTML=`<p>${Ptime}</p><img src=http:${icon}><p>${formatTemp(temp)}</p>`;
	container.appendChild(wrapper);

}

function hourdata(time,data){
		// Get the current time
	const currentTime = new Date(data['location']['localtime'].split(" ")[1]);
	const currentHours = data['location']['localtime'].split(" ")[1].split(":")[0];
	const currentMinutes = data['location']['localtime'].split(" ")[1].split(":")[1];
	const [hour, minute] = time.split(':');
	if (currentHours <= parseInt(hour) || (currentHours === parseInt(hour) && currentMinutes <= parseInt(minute))) {
	    return true;
	 }

}

function uvIndex(data){
	let {current:{uv}}=data;
	let UVwrapper=document.querySelector('.uvValue');
	UVwrapper.innerHTML=uv;
}

function loadwind(data){
	let {current:{wind_kph}}=data;
	let text=document.querySelector('.windValue');
	text.textContent=wind_kph+"kph";
}

function loadpresci(data){
	let {current:{precip_mm}}=data;
	let text=document.querySelector('.presciValue');
	text.textContent=precip_mm+"mm";
}

function loadpressure(data){
	let {current:{pressure_mb}}=data;
	let text=document.querySelector('.presValue');
	text.textContent=pressure_mb+"hPa";
}

function loadhumidity(data){
	let {current:{humidity}}=data;
	let text=document.querySelector('.HumidityValue');
	text.textContent=humidity+"%";
}

function loadfeels(data){
	let {current:{feelslike_c}}=data;
	let text=document.querySelector('.feels_likeValue');
	text.textContent=formatTemp(feelslike_c);
}

function loadvisible(data){
	let {current:{vis_km}}=data;
	let text=document.querySelector('.visibleValue');
	text.textContent=vis_km+"km";
}

function loadsunset(data){
	// let {forecast:{forecastday:{0:{astro:{sunrise,sunset}}}}}=data;
	const { forecast: { forecastday } } = data;
	const { astro: { sunrise, sunset } } = forecastday[0];
	let text=document.querySelector('.sunrise');
	let set=document.querySelector('.sunset');
	text.textContent=sunrise;
	set.textContent=sunset;
}

function getCoordinates(successCallback, errorCallback) {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      successCallback(latitude, longitude);
    }, function(error) {
      errorCallback(error);
    });
  } else {
    errorCallback("Geolocation is not available in this browser.");
  }
}

function currentLocationWeather(){
	let lat="";
  	let lon="";
  	getCoordinates(function(latitude, longitude) {
  		lat=latitude;
  		lon=longitude;
  		let baseUrl="https://api.weatherapi.com/v1/forecast.json?key="+KEY+"&q="+lat+","+lon+"&days=5";
  		let response=loadMainContent(baseUrl);
  		if(response)
  			return;
		}, function(error) {
  			console.error(error);
		});
}

async function loadMainContent(baseUrl){
	let data=await fetchdata(baseUrl);
	await loadcurrentweather(data);
	await five_day_forecast(data);
	await hourly_forecast(data);
	await uvIndex(data);
	await loadwind(data);
	await loadpresci(data);
	await  loadpressure(data);
	await loadhumidity(data);
	await loadfeels(data);
	await loadvisible(data);
	await loadsunset(data);  
}

document.addEventListener("DOMContentLoaded", function() { 
  currentLocationWeather();
  let cityName=document.querySelector(".searchbtn");
  cityName.addEventListener("click",function(){
  city=document.querySelector(".searchcity").value;
  document.querySelector(".searchcity").value="";
  // console.log(`city ${city}`);
  let baseUrl="https://api.weatherapi.com/v1/forecast.json?key="+KEY+"&q="+city+"&days=5";
  let reponse=loadMainContent(baseUrl);
  
  });
  	let Location=document.querySelector(".currentLocation");
  	Location.addEventListener("click", function (){
  		currentLocationWeather();
  	});
});

