var currCountry = null;
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
	if ($("#info").css("display") === "none") {
		$("#info").css({display: "block"});
	} else {
		$("#info").css({display: "none"});
	}
}).addTo(map);

var borderLayer;		//Establish map layer for borders

//Plus/Minus buttons in Info Box

$('#click1').click(function() {
	$("#cityData").css({display: "block"});

	if ($("#toggleWord1").html() === "show") {
		$("#toggleWord1").html("hide");
		$("#capitalPlus").attr({src: "libs/images/minus.png"});
	} else {
		$("#toggleWord1").html("show");
		$("#capitalPlus").attr({src: "libs/images/plus.png"});
		$("#cityData").css({display: "none"});
	}

});

$('#click2').click(function() {
	$("#countryData").css({display: "block"});

	if ($("#toggleWord2").html() === "show") {
		$("#toggleWord2").html("hide");
		$("#countryPlus").attr({src: "libs/images/minus.png"});
	} else {
		$("#toggleWord2").html("show");
		$("#countryPlus").attr({src: "libs/images/plus.png"});
		$("#countryData").css({display: "none"});
	}
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

			// console.log(currCountry);
			// console.log(cInfo);

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
				$("#capName").html(cInfo.capital);
				$("#pop").html(cInfo.population);
				$("#area").html(cInfo.areaInSqKm);
				$("#lang").html(cInfo.languages);
				$("#continent").html(cInfo.continentName);
				$("#neigh").html("");
				neighbours.forEach(element => {
					$("#neigh").append('<li>' + element.countryName + '</li>');
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

			// console.log(coord1);
			// console.log(coord2);
			// console.log(capitalWeather);

			$("#capWeatherImg").attr({src: 'http://openweathermap.org/img/wn/' + capitalWeather.weather[0].icon + '.png'});
			$("#capWeather").html("");
			$("#capWeather").append('Max temp: ' + (capitalWeather.main.temp_max - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#capWeather").append('Min temp: ' + (capitalWeather.main.temp_min - 273.15).toFixed(1) + ' &#176;C<br>');
			$("#capWeather").append('Feels like: ' + (capitalWeather.main.feels_like - 273.15).toFixed(1) + ' &#176;C<br>');

			
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