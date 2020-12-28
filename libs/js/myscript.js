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
		dashArray: '3',
		fillOpacity: 0
	};
}

// $('#myModal').on('shown.bs.modal', function () {
// 	$('#myInput').trigger('focus')
//   })

//Plus/Minus buttons in Info Box

$('#capitalPlus').click(function() {
	document.getElementById("cityData").style.display = "inherit";

	if (document.getElementById("toggleWord1").innerHTML === "show") {
		document.getElementById("toggleWord1").innerHTML = "hide";
		document.getElementById("capitalPlus").src = "libs/images/minus.png";
	} else {
		document.getElementById("toggleWord1").innerHTML = "show";
		document.getElementById("capitalPlus").src = "libs/images/plus.png";
		document.getElementById("cityData").style.display = "none";
	}

});

$('#countryPlus').click(function() {
	document.getElementById("countryData").style.display = "inherit";

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
		var lat = position.coords.latitude;
		var long = position.coords.longitude;

		$.ajax({
			url: "libs/php/getInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				myLat: lat,
				myLong: long
			},
			
			success: function(result) {
	
				var info = result.data.countryInfo;
	
				if (result.status.name == "ok") {
	
					// info.geonames.forEach(element => {
					// 	if ((element.north >= lat) && (element.south <= lat) && (element.east >= long) && (element.west <= long)) {
					// 		var myCountry = element.countryCode;
					// 		setTimeout(function() {$("#countrySel").val(myCountry).change();}, 200);	
					// 	}
						
					// });

					console.log(info);
	
					
	
					
	
	
	
				}
	
				
						
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log("getLocation error");
			}
		}); 








		
		
		
	}




	

};

// On change of country

function eventChanger() {	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',

		success: function(result) {

			var country = result.data.borders;

			if (result.status.name == "ok") {

				var borderLayer;		//Establish map layer for borders

				$('select').change(function() {
					var currCountry = $(countrySel).val();

					document.getElementById("info").style.display = "none";
					
					//clear all borders
					if (borderLayer !== undefined) {
						borderLayer.clearLayers();
					}

					//Establish maximum boundaries
					var mostS = 90;
					var mostN = -90;
					var mostE = -180;
					var mostW = 180;

					//Attached border to current country and fill screen
					country.forEach(element => {
						if (element.code.indexOf(currCountry) !== -1) {
							console.log(element);
							document.getElementById("countryName").innerHTML = element.name;
							borderLayer = L.geoJson(element.geo, {style: styleOn}).addTo(map);

							if (element.geo.coordinates[0][0][0][0]) { //for countries with multiple landmasses
								element.geo.coordinates.forEach(mass => {
									mass[0].forEach(coord => {
									
										if (coord[1] < mostS) {
											mostS = coord[1];
										}
										
										if (coord[1] > mostN) {
											mostN = coord[1];
										}

										if (coord[0] < mostW) {
											mostW = coord[0];
										}

										if (coord[0] > mostE) {
											mostE = coord[0];
										}

									});
										
								});

							} else { //for countries with a single landmass
								element.geo.coordinates[0].forEach(coord => {

									if (coord[1] < mostS) {
										mostS = coord[1];
									}
									
									if (coord[1] > mostN) {
										mostN = coord[1];
									}

									if (coord[0] < mostW) {
										mostW = coord[0];
									}

									if (coord[0] > mostE) {
										mostE = coord[0];
									}

								});

							}

							map.fitBounds([[mostS, mostW], [mostN, mostE]]);
							
						}

					});
	
				});

			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("eventChanger error");
		}
	}); 

};


















// preloader

$(document).ready(function () {
    if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});