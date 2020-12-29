var lat = null;
var long = null;
var currCountry = "AS";
var borderLayer;		//Establish map layer for borders
var capital = null;
var coord1 = 0;
var coord2 = 0;

// initialise map

var map = L.map( 'mapid');
map.locate({setView: true, maxZoom: 5});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

L.easyButton('<img width="100%" height="auto" src="libs/images/info.png">', function(){
	if (document.getElementById("info").style.display === "none") {
		document.getElementById("info").style.display = "block";
	} else {
		document.getElementById("info").style.display = "none";
	}
}).addTo(map);

function styleOn(feature) {
	return {
		weight: 3,
		opacity: 1,
		color: 'black',
		dashArray: '0',
		fillOpacity: 0
	};
}

// $('#myModal').on('shown.bs.modal', function () {
// 	$('#myInput').trigger('focus')
//   })

//Plus/Minus buttons in Info Box

$('#click1').click(function() {
	document.getElementById("cityData").style.display = "block";

	if (document.getElementById("toggleWord1").innerHTML === "show") {
		document.getElementById("toggleWord1").innerHTML = "hide";
		document.getElementById("capitalPlus").src = "libs/images/minus.png";
	} else {
		document.getElementById("toggleWord1").innerHTML = "show";
		document.getElementById("capitalPlus").src = "libs/images/plus.png";
		document.getElementById("cityData").style.display = "none";
	}

});

$('#click2').click(function() {
	document.getElementById("countryData").style.display = "block";

	if (document.getElementById("toggleWord2").innerHTML === "show") {
		document.getElementById("toggleWord2").innerHTML = "hide";
		document.getElementById("countryPlus").src = "libs/images/minus.png";
	} else {
		document.getElementById("toggleWord2").innerHTML = "show";
		document.getElementById("countryPlus").src = "libs/images/plus.png";
		document.getElementById("countryData").style.display = "none";
	}
});

// Ajax

function popList() {	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			myLat: lat,
			myLong: long,
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2
		},

		success: function(result) {

			var country = result.data.borders;

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
		lat = position.coords.latitude;
		long = position.coords.longitude;
		// console.log(position);

		$.ajax({
			url: "libs/php/getInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				myLat: lat,
				myLong: long,
				country: currCountry,
				capital: capital,
				coord1: coord1,
				coord2: coord2
			},
			
			success: function(result) {
	
				var code = result.data.countryCode;
	
				if (result.status.name == "ok") {

					document.getElementById("info").style.display = "none";

					$("#countrySel").val(code.countryCode).change();
	
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
			myLat: lat,
			myLong: long,
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2
		},

		success: function(result) {

			var cBorders = result.data.borders;
			var cInfo = result.data.countryInfo.geonames[0];
			var neighbours = result.data.neighbours.geonames;

			// console.log(currCountry);
			// console.log(cInfo);

			if (result.status.name == "ok") {

				// document.getElementById("info").style.display = "none";

				cBorders.forEach(element => {
					if (element.code.indexOf(currCountry) !== -1) {
						map.fitBounds([[cInfo.south, cInfo.west], [cInfo.north, cInfo.east]]);
						

						//clear all borders
						if (borderLayer !== undefined) {
							borderLayer.clearLayers();
						}
						//attach borders
						borderLayer = L.geoJson(element.geo, {style: styleOn}).addTo(map);

					}

				});

				document.getElementById("countryName").innerHTML = cInfo.countryName;
				document.getElementById("capName").innerHTML = cInfo.capital;
				document.getElementById("pop").innerHTML = cInfo.population;
				document.getElementById("area").innerHTML = cInfo.areaInSqKm;
				document.getElementById("lang").innerHTML = cInfo.languages;
				document.getElementById("continent").innerHTML = cInfo.continentName;
				document.getElementById("neigh").innerHTML = "";
				neighbours.forEach(element => {
					document.getElementById("neigh").innerHTML += '<li>' + element.countryName + '</li>';
				});

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
			myLat: lat,
			myLong: long,
			country: currCountry,
			capital: str,
			coord1: coord1,
			coord2: coord2
		},

		success: function(result) {

			var capInfo = result.data.cap.results[0];

			// console.log(str);
			console.log(capInfo);

			document.getElementById("capLat").innerHTML = capInfo.geometry.lat;
			document.getElementById("capLong").innerHTML = capInfo.geometry.lng;
			document.getElementById("call").innerHTML = capInfo.annotations.callingcode;
			document.getElementById("currency").innerHTML = capInfo.annotations.currency.name + ' ' + capInfo.annotations.currency.symbol;
			document.getElementById("drive").innerHTML = capInfo.annotations.roadinfo.drive_on;
			document.getElementById("capTZ").innerHTML = capInfo.annotations.timezone.name + ', ' + capInfo.annotations.timezone.offset_string;
			
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
			myLat: lat,
			myLong: long,
			country: currCountry,
			capital: capital,
			coord1: coord1,
			coord2: coord2
		},

		success: function(result) {

			var capitalWeather = result.data.weather;

			console.log(coord1);
			console.log(coord2);
			console.log(capitalWeather);

			document.getElementById("capWeatherImg").src = 'http://openweathermap.org/img/wn/' + capitalWeather.weather[0].icon + '.png';
			document.getElementById("capWeather").innerHTML += 'Max temp: ' + (capitalWeather.main.temp_max - 273.15).toFixed(2) + ' &#176;C<br>';
			document.getElementById("capWeather").innerHTML += 'Min temp: ' + (capitalWeather.main.temp_min - 273.15).toFixed(2) + ' &#176;C<br>';
			document.getElementById("capWeather").innerHTML += 'Feels like: ' + (capitalWeather.main.feels_like - 273.15).toFixed(2) + ' &#176;C<br>';

			
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
});