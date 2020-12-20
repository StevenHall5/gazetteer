// navigator.geolocation for current user location
var a = 0;
var b = 0;

function getLocation() {
  	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
  	} else { 
    	console.log("Geolocation is not supported by this browser.");
  	}
}

var showPosition = function (position) {
	// console.log(position);
	  a = position.coords.latitude;
	  b = position.coords.longitude;
	// console.log(a);
	// console.log(b);
	
}

// console.log(a);
// console.log(b);


// initialise map

var map = L.map( 'mapid');
map.locate({setView: true, maxZoom: 5});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo( map );

function styleOn(feature) {
	return {
		weight: 3,
		opacity: 1,
		color: 'black',
		dashArray: '3',
		fillOpacity: 0
	};
}

// Ajax

function popList() {	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',

		success: function(result) {

			var country = result.data;

			if (result.status.name == "ok") {

				$(country).each(function() {
					$(countrySel).append($("<option>").attr('value', this.code).text(this.name));
				});

				var borderLayer;		//Establish map layer for borders

				$('#btnRun').click(function() {
					var currCountry = $(countrySel).val();
					console.log(currCountry);

					document.getElementById("info").style.display = "inherit";
					
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

			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("error");
		}
	}); 

};
















// preloader

$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});