var currCountry = null;
var capital = null;
var coord1 = 0;
var coord2 = 0;

// initialise map

var map = L.map( 'mapid');
map.locate({setView: true, maxZoom: 5});

L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);



var weatherButton = L.easyButton('<img src="libs/images/weather.svg">', function(){
	$('#weatherModal').modal('show');
}).addTo(map);

L.easyButton('<img src="libs/images/info.png" width="100%">', function(){
	$('#countryModal').modal('show');
}).addTo(map);

L.easyButton('<img src="libs/images/virus.png" width="100%">', function(){
	$('#covidModal').modal('show');
}).addTo(map);

var borderLayer;		//Establish map layer for borders

$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

// Ajax

function popList() {
	
	// $('#myModal').modal('show');

	$.ajax({
		url: "libs/php/popList.php",
		type: 'POST',
		dataType: 'json',

		success: function(result) {

			var country = result.data;

			if (result.status.name == "ok") {

				$(country).each(function() {
					$(countrySel).append($("<option>").attr('value', this.code).text(this.name));
				});

			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("popList error");
		}
	}); 

};

// launch site at current user location

function getLocation() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else { 
		console.log("Geolocation is not supported by this browser.");
		
	}
	
	function showPosition(position) {
		var lat = position.coords.latitude;
		var long = position.coords.longitude;
		// console.log(position);

		$.ajax({
			url: "libs/php/getLocation.php",
			type: 'POST',
			dataType: 'json',
			data: {
				myLat: lat,
				myLong: long
			},
			
			success: function(result) {
	
				var countryCode = result.data;
	
				if (result.status.name == "ok") {

					$("#info").css({display: "none"});

					$("#countrySel").val(countryCode).change();
	
				}
					
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("getLocation error");
			}
		}); 		
		
	}

};

// On change of country

$('select').change(function() {
	currCountry = $(countrySel).val();
	
	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2
		},

		success: function(result) {

			var cBorders = result.data.borders;
			var cInfo = result.data.countryInfo.geonames[0];
			var neighbours = result.data.neighbours.geonames;
			var restCountry = result.data.restCountry;
			// var exData = result.data.exData;
			var currencyCode = restCountry.currencies[0].code;
			var covid = result.data.covid.data;

			

			// console.log(covid);
			

			if (result.status.name == "ok") {

				cBorders.forEach(element => {
					if (element.code.indexOf(currCountry) !== -1) {
		
						//clear all borders
						if (borderLayer !== undefined) {
							borderLayer.clearLayers();
						}
						//attach borders
						function styleOn() {
							return {
								weight: 3,
								opacity: 1,
								color: 'black',
								fillOpacity: 0
							};
						}

						borderLayer = L.geoJson(element.geo, {style: styleOn}).addTo(map);

						map.fitBounds(borderLayer.getBounds());

					}

				});

				$("#countryName").html(cInfo.countryName);
				$("#capName1").html(cInfo.capital);
				$("#capName2").html(cInfo.capital);
				$("#pop").html(cInfo.population).digits();
				$("#area").html(cInfo.areaInSqKm).digits();
				$("#lang").html("");
				restCountry.languages.forEach(element => {
					$("#lang").append('<li>' + element.name + '</li>');
				});
				$("#continent").html(cInfo.continentName);
				// $("#exRate").html('1 USD is ' + exData[currencyCode] + ' ' + currencyCode);
				$("#flag").attr({src: restCountry.flag});
				$("#neigh").html("");
				neighbours.forEach(element => {
					$("#neigh").append('<li>' + element.countryName + '</li>');
				});
				$("#cases").html(covid.today.confirmed);
				$("#deaths").html(covid.today.deaths);
				$("#allCases").html(covid.latest_data.confirmed);
				$("#allDeaths").html(covid.latest_data.deaths);
				$("#allRecovered").html(covid.latest_data.recovered);
				$("#casesPerMill").html(covid.latest_data.calculated.cases_per_million_population);

				const spaceSwap = / /gi;
				var capStr = cInfo.capital.replace(spaceSwap, '%20') + '%20' + cInfo.countryName.replace(spaceSwap, '%20');
				// console.log(capStr);
				capData(capStr);		

			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("eventChanger error");
		}
	}); 
	
});

function capData(str) {	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: currCountry,
			capital: str,
			coord1: coord1,
			coord2: coord2
		},

		success: function(result) {

			var capInfo = result.data.cap.results[0];

			// console.log(str);
			// console.log(capInfo);

			$("#capLat").html(capInfo.geometry.lat);
			$("#capLong").html(capInfo.geometry.lng);
			$("#call").html(capInfo.annotations.callingcode);
			$("#currency").html(capInfo.annotations.currency.name + ' ' + capInfo.annotations.currency.symbol);
			$("#drive").html(capInfo.annotations.roadinfo.drive_on);
			$("#capTZ").html(capInfo.annotations.timezone.name + ', ' + capInfo.annotations.timezone.offset_string);
			
			moreCapData(capInfo.geometry.lat, capInfo.geometry.lng);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("capData error");
		}
	}); 

};

function moreCapData(coord1, coord2) {	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2
		},

		success: function(result) {

			var capitalWeather = result.data.weather;
			var UVData = result.data.UVData;
			UVData = Number(UVData);
			var UVLevel;
			var UVColor;
			if (UVData < 3) {
				UVLevel = "Low";
				UVColor = "#558B2F";
			} else if (UVData < 6) {
				UVLevel = "Moderate";
				UVColor = "#F9A825";
			} else if (UVData < 8) {
				UVLevel = "High";
				UVColor = "#EF6C00";
			} else if (UVData < 11) {
				UVLevel = "Very High";
				UVColor = "#B71C1";
			} else {
				UVLevel = "Extreme";
				UVColor = "#6A1B9A";
			}

			// console.log(UVLevel);
			// console.log(UVColor);
			// console.log(capitalWeather);

			$("#capWeatherImg").attr({src: 'http://openweathermap.org/img/wn/' + capitalWeather.weather[0].icon + '.png'});
			$("#capWeather").html('');
			$("#capWeather").append(capitalWeather.weather[0].description + '<br>').css({textTransform: 'capitalize'});
			$("#capWeather").append('Max temp: ' + (capitalWeather.main.temp_max - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#capWeather").append('Min temp: ' + (capitalWeather.main.temp_min - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#capWeather").append('Feels like: ' + (capitalWeather.main.feels_like - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#capWeather").append('Humidity: ' + (capitalWeather.main.humidity) + ' %<br>');
			$("#capWeather").append('Wind Speed: ' + (capitalWeather.wind.speed * 3600 / 1000) + ' km/h<br>');
			$("#capUV").html(UVLevel + ' ' + UVData + ' ');
			$('#UVBox').css({backgroundColor: UVColor});
			

			
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("capData error");
		}
	}); 

};














// preloader

$(document).ready(function () {
    if ($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function () {
            $(this).remove();
        });
	}
	popList();
	getLocation();
});