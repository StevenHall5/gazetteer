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

				var marker;		//Establish map layer for borders

				$('#btnRun').click(function() {
					var currCountry = $(countrySel).val();
					console.log(currCountry);
					
					//clear all borders
					if (marker !== undefined) {
						marker.clearLayers();
					}

					//Attached border to current country
					result.data.forEach(element => {
						if (element.code.indexOf(currCountry) !== -1) {
							console.log(element);
							marker = L.geoJson(element.geo, {style: styleOn}).addTo(map);
						}	
					});

					function styleOn(feature) {
					    return {
					        weight: 3,
					        opacity: 1,
					        color: 'black',
					        dashArray: '3',
					        fillOpacity: 0
					    };
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