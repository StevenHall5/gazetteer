var currCountry = null;
var capital = null;
var coord1 = 0;
var coord2 = 0;
var north = 0;
var south = 0;
var east = 0;
var west = 0;
var city = null;

//Establish map layers

var borderLayer;
var cityMarkers = L.markerClusterGroup();
var eQMarkers = L.markerClusterGroup();
var parkMarkers = L.markerClusterGroup();

// initialise map

var regularMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var map = L.map('mapid', {layers: [regularMap]});
map.locate({setView: true, maxZoom: 5});

var baseMaps = {
    "Standard": regularMap,
    "Topographical": OpenTopoMap
};

var overlayMaps = {
	"Cities": cityMarkers,
	"Earthquakes": eQMarkers,
	"National Parks": parkMarkers
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

L.easyButton('fa-info-circle', function(){
	$('#countryModal').modal('show');
}).addTo(map);

L.easyButton('fa-virus', function(){
	$('#covidModal').modal('show');
}).addTo(map);

$.fn.digits = function(){ 	//adds commas into long numbers
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

function choice(element) {

	cityStart(element);
	
	//Menu Page
	function cityStart() {
		$('#cityModal').modal('show');
		$('#cityTitle').html('Choose for ' + element.name + ':');
		$('.modal-header').css({backgroundColor: 'black', color: 'white'});
		$('#cityTable').html('<tr></tr>');
		$('#cityTable').append('<tr id="weatherRow">\
								<td class="left"><i class="fas fa-cloud-sun"></i></td>\
								<td><h2>Weather</h2></td>\
								</tr>');
		$('#cityTable').append('<tr id="newsRow">\
								<td class="left"><i class="fas fa-newspaper"></i></td>\
								<td><h2>News</h2></td>\
								</tr>');
		$('#cityTable').append('<tr id="picRow">\
								<td class="left"><i class="fas fa-camera"></i></td>\
								<td><h2>Pictures</h2></td>\
								</tr>');
		$('#cityTable').append('<tr id="wikiRow">\
								<td class="left"><i class="fab fa-wikipedia-w"></i></td>\
								<td><h2>Wikipedia</h2></td>\
								</tr>');
	}

	//Weather Page

	$('#weatherRow').click(function() {
		weather(element);
		$('#cityTitle').html('Weather for ' + element.name);
		$('.modal-header').css({backgroundColor: 'red', color: 'white'});
		$('#cityTable').html('');
		
	});
	
	// News Page
	$('#newsRow').click(function() {
		news(element);
		$('#cityTitle').html('Local news for ' + element.name);
		$('.modal-header').css({backgroundColor: 'orange', color: 'black'});
		$('#cityTable').html('');	
	});

	// Picture Page
	$('#picRow').click(function() {
		pictures(element);
		$('#cityTitle').html('Pictures of ' + element.name);
		$('.modal-header').css({backgroundColor: 'navy', color: 'white'});
		$('#cityTable').html('');	
	});

	//Wiki Link
	$('#wikiRow').click(function() {
		const spaceSwap = / /gi;
		var selectedCity = element.name.replace(spaceSwap, '%20') + '%2C%20' + element.countryName.replace(spaceSwap, '%20');

		window.open('https://en.wikipedia.org/wiki/' + selectedCity, '_blank')
	})

}

//Marker styles

var eqMarker = L.icon({
	iconUrl: 'libs/images/earthquake.png',
	iconSize: [40, 40]

});

var parkMarker = L.ExtraMarkers.icon({
	icon: 'fa-leaf',
	iconColor: 'white',
	markerColor: 'green',
	shape: 'circle',
	prefix: 'fa'
});

var cityMarker = L.ExtraMarkers.icon({
	icon: 'fa-city',
	iconColor: 'white',
	markerColor: 'orange-dark',
	shape: 'circle',
	prefix: 'fa'
});

// Ajax

function popList() {

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
				console.log(jqXHR);
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
			coord2: coord2,
			north: north,
			south: south,
			east: east,
			west: west,
			city: city
		},

		success: function(result) {

			var cBorders = result.data.borders;
			var cInfo = result.data.countryInfo.geonames[0];
			var neighbours = result.data.neighbours.geonames;
			var restCountry = result.data.restCountry;
			var exData = result.data.exData;
			var currencyCode = restCountry.currencies[0].code;
			var covid = result.data.covid.data;
			var city = result.data.city.geonames;

			if (result.status.name == "ok") {

				cBorders.forEach(element => {
					if (element.code.indexOf(currCountry) !== -1) {
		
						//clear all borders
						if (borderLayer !== undefined) {
							borderLayer.clearLayers();
						}

						//clear all borders
						if (eQMarkers !== undefined) {
							eQMarkers.clearLayers();
						}

						//clear all borders
						if (parkMarkers !== undefined) {
							parkMarkers.clearLayers();
						}

						//clear all borders
						if (cityMarkers !== undefined) {
							cityMarkers.clearLayers();
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

				
				city.forEach(element => {
					cityMarkers.addLayer(L.marker([element.lat, element.lng], {icon: cityMarker}).on('click', function() {
						choice(element);
					}))
				});

				borderLayer.addLayer(cityMarkers);

				$("#countryName").html(cInfo.countryName);
				$("#capName2").html(cInfo.capital);
				$("#pop").html(cInfo.population).digits();
				$("#area").html(cInfo.areaInSqKm).digits();
				
				var langStr = "";
				restCountry.languages.forEach(element => {
					langStr += element.name + ', ';
				});
				$("#lang").html(langStr.slice(0, -2));
		
				$("#continent").html(cInfo.continentName);
				$("#exRate").html('1 USD is ' + exData[currencyCode] + ' ' + currencyCode);
				$("#flag").attr({src: restCountry.flag});
				if (neighbours.length === 0) {
					$("#neigh").html("None");
				} else {
					var neighStr = "";
					neighbours.forEach(element => {
						neighStr += element.name + ', ';
					});
					$("#neigh").html(neighStr.slice(0, -2));
				}				
				$("#cases").html(covid.today.confirmed);
				$("#deaths").html(covid.today.deaths);
				if (covid.latest_data.confirmed === 0) {
					$("#allCases").html("N/A")
				} else {
					$("#allCases").html(covid.latest_data.confirmed).digits();
				}
				if (covid.latest_data.deaths === 0) {
					$("#allDeaths").html("N/A")
				} else {
					$("#allDeaths").html(covid.latest_data.deaths).digits();
				}
				if (covid.latest_data.recovered === 0) {
					$("#allRecovered").html("N/A")
				} else {
					$("#allRecovered").html(covid.latest_data.recovered).digits();
				}
				if (covid.latest_data.calculated.cases_per_million_population === 0) {
					$("#casesPerMill").html("N/A")
				} else {
					$("#casesPerMill").html(covid.latest_data.calculated.cases_per_million_population).digits();
				}

				const spaceSwap = / /gi;
				var capStr = cInfo.capital.replace(spaceSwap, '%20') + '%20' + cInfo.countryName.replace(spaceSwap, '%20');
				capData(capStr);
				
				north = cInfo.north;
				south = cInfo.south;
				east = cInfo.east;
				west = cInfo.west;
				
				earthquakeAndParks(north, south, east, west);	

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
			coord2: coord2,
			north: north,
			south: south,
			east: east,
			west: west,
			city: city
		},

		success: function(result) {

			var capInfo = result.data.cap.results[0];

			$("#call").html(capInfo.annotations.callingcode);
			$("#currency").html(capInfo.annotations.currency.name + ' ' + capInfo.annotations.currency.symbol);
			$("#drive").html(capInfo.annotations.roadinfo.drive_on);
			$("#capTZ").html(capInfo.annotations.timezone.name + ', ' + capInfo.annotations.timezone.offset_string);

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("capData error");
		}
	}); 

};

function weather(element) {	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: currCountry,
			capital: capital,
			coord1: element.lat,
			coord2: element.lng,
			north: north,
			south: south,
			east: east,
			west: west,
			city: city
		},

		success: function(result) {

			var capitalWeather = result.data.weather;
			var UVData = result.data.UVAndForecastData.current.uvi;
			var windSpeed = capitalWeather.wind.speed * 3600 / 1000;
			var forecast = result.data.UVAndForecastData.daily;
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
				UVColor = "#B71C1C";
			} else {
				UVLevel = "Extreme";
				UVColor = "#6A1B9A";
			}

			$('#cityTable').append('<tr>\
								<td class="left"><i class="fas fa-cloud-sun-rain"></i></td>\
								<td><span id="capWeather"></span></td>\
								<td class="right"><img id="capWeatherImg" src=""></td>\
								</tr>');
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-temperature-high"></i></td>\
									<td>Max temp:</td>\
									<td class="right"><span id="maxTemp"></span></td>\
									</tr>');
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-temperature-low"></i></td>\
									<td>Min temp:</td>\
									<td class="right"><span id="minTemp"></span></td>\
									</tr>');
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-thermometer"></i></td>\
									<td>Feel Like:</td>\
									<td class="right"><span id="feels"></span></td>\
									</tr>');
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-grin-beam-sweat"></i></td>\
									<td>Humidity:</td>\
									<td class="right"><span id="humid"></span></td>\
									</tr>');
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-wind"></i></td>\
									<td>Wind Speed:</td>\
									<td class="right"><span id="wind"></span></td>\
									</tr>');
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-sun"></i></td>\
									<td>UV Index:</td>\
									<td class="right"><span id="capUV"></span> <div id="UVBox"></div></td>\
									</tr>');
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-map-marker-alt"></i></td>\
									<td>Location:</td>\
									<td class="right"><span id="capLat"></span>, <span id="capLong"></span></td>\
									</tr>');	
			$('#cityTable').append('<tr>\
									<td class="left"><i class="fas fa-cloud-sun-rain"></i></td>\
									<td colspan="2">Forecast:</td>\
									</tr>\
									<tr id="makeWhite">\
									<td class="left"></td>\
									<td class="smallCell" id="forecastRow1" colspan="2"></td>\
									</tr>\
									<tr>\
									<td class="left"></td>\
									<td class="smallCell" id="forecastRow2" colspan="2"></td>\
									</tr>\
									<tr class="lastRow">\
									<td class="left"></td>\
									<td id="backToMenu" class="right" colspan="2">Back to Menu</td>\
									</tr>');
			$('#backToMenu').click(function() {choice(element)});

			$("#capWeatherImg").attr({src: 'http://openweathermap.org/img/wn/' + capitalWeather.weather[0].icon + '.png'});
			$("#capName1").html(element.name);
			$("#capWeather").html(capitalWeather.weather[0].description).css({textTransform: 'capitalize'});
			$("#maxTemp").html((capitalWeather.main.temp_max - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#minTemp").html((capitalWeather.main.temp_min - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#feels").html((capitalWeather.main.feels_like - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#humid").html((capitalWeather.main.humidity) + ' %<br>');
			$("#wind").html(windSpeed.toFixed(1) + ' km/h<br>');
			$("#capUV").html(UVLevel + ' ' + UVData + ' ');
			$('#UVBox').css({backgroundColor: UVColor});
			$("#forecastRow1").html('<td class=smallCell></td>');
			$("#forecastRow2").html('<td class=smallCell></td>');
			$("#capLat").html(element.lat.slice(0, 6));
			$("#capLong").html(element.lng.slice(0, 6));

			for (let i = 1; i <=5; i++) {
				$("#forecastRow1").append('<div class="smallCell addBox"><img src="http://openweathermap.org/img/wn/' + forecast[i].weather[0].icon + '.png">');
				$("#forecastRow2").append('<td class="smallCell addBox">' + new Date(forecast[i].dt*1000).toString().slice(0, 3) + '<br>' +
											(forecast[i].temp.day - 273.15).toFixed(1) + ' &#176;C<br>' +
											forecast[i].weather[0].main + '</td>');
			}	
			
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("capData error");
		}
	}); 

};

function news(element) {	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2,
			north: north,
			south: south,
			east: east,
			west: west,
			city: element.name
		},

		success: function(result) {

			var news = result.data.news.articles;

			news.forEach(element => {
				
				$('#cityTable').append('<tr>\
				<td class="left"><i class="fas fa-pen"></i></td>\
				<td><a href="' + element.url + '" target="_blank"><h4>' + element.title + '</h4><figure><img src="' + element.urlToImage + '" width="50%"><figcaption>' + element.source.name + ', ' + element.publishedAt.slice(0, 10) + '</figcaption></figure>\
				<p>' + element.description + '</p></a></td>\
				</tr>');

			});
			$('#cityTable').append('<tr class="lastRow">\
								<td class="left"></td>\
								<td  id="backToMenu" class="right" colspan="2">Back to Menu</td>\
								</tr>');
			$('#backToMenu').click(function() {choice(element)});
	
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("capData error");
		}
	}); 

};

function pictures(element) {	

	const spaceSwap = / /gi;
	var selectedCity = element.name.replace(spaceSwap, '+') + '+' + element.countryName.replace(spaceSwap, '+');

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2,
			north: north,
			south: south,
			east: east,
			west: west,
			city: selectedCity
		},

		success: function(result) {

			var pics = result.data.pics.hits;

			pics.forEach(element => {
				$('#cityTable').append('<tr><td><figure><img src="' + element.webformatURL + '" class="modalPicture"></figure></td></tr>');
			});
			$('#cityTable').append('<tr class="lastRow">\
								<td id="backToMenu" class="right">Back to Menu</td>\
								</tr>');
			$('#backToMenu').click(function() {choice(element)});

		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("capData error");
		}
	}); 

};

function earthquakeAndParks(n, s, e, w) {	

	north = n;
	south = s;
	east = e;
	west = w;

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2,
			north: north,
			south: south,
			east: east,
			west: west,
			city: city
		},

		success: function(result) {

			var eQ = result.data.earthquake.earthquakes;
			var park = result.data.park.features;
			
			eQ.forEach(element => {
				var year = element.datetime.slice(0,4);
				var month = element.datetime.slice(5,7);
				var day = element.datetime.slice(8,10);
				var time = element.datetime.slice(11,16);
				eQMarkers.addLayer(L.marker([element.lat, element.lng], {icon: eqMarker}).bindPopup('<h3 id="eqTitle"> Earthquake </h3><p><i class="fas fa-thumbtack"></i> Lat, Long: ' + element.lat.toString() + ', ' + element.lng.toString() + '</p><p><i class="fas fa-chart-bar"></i> Magnitude: ' + element.magnitude.toString() + '</p><p><i class="fas fa-calendar-alt"></i> Date: ' + day + '/' + month + '/' + year + '</p><p><i class="fas fa-clock"></i> Time: ' + time + '</p>'));
			
			});
			borderLayer.addLayer(eQMarkers);

			park.forEach(element => {
				parkMarkers.addLayer(L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], {icon: parkMarker}).bindPopup('<h3 id="parkTitle">' + element.properties.name + '</h3><p><i class="fas fa-map-pin"></i> Lat, Long: ' + element.geometry.coordinates[1].toFixed(4).toString() + ', ' + element.geometry.coordinates[0].toFixed(4).toString()));
			});
			borderLayer.addLayer(parkMarkers);

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