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

			// console.log(result);
			var country = result.data.currency;
			// var countryData = result.test.features;

			// console.log(country);
			// console.log(countryData);

			if (result.status.name == "ok") {

				$(country).each(function() {
					$(countrySel).append($("<option>").attr('value', this.code).text(this.name));
				});

				$('#btnRun').click(function() {
					var currCountry = $(countrySel).val();
					console.log(currCountry);

					// Object.keys(result).forEach(function (item) {
					// 	console.log(item); // key
					// 	console.log(result[item]); // value
					// });


					result.data.currency.forEach(element => {
						// L.geoJson(element.geo, {style: styleOff}).addTo(map);
						if (element.code.indexOf(currCountry) !== -1) {
							console.log(element);
							L.geoJson(element.geo, {style: styleOn}).addTo(map);
						}	
					});

					function styleOff(feature) {
					    return {
					        weight: 0,
					        opacity: 0,
					        color: 'red',
					        dashArray: '3',
					        fillOpacity: 0
					    };
					}

					function styleOn(feature) {
					    return {
					        weight: 5,
					        opacity: 1,
					        color: 'black',
					        dashArray: '3',
					        fillOpacity: 0
					    };
					}

					
					
					
					
					
					
					
					
					
					
					// getLocation();
					// var filteredObj = country.find(function(item, i){
					// 	if(item.name === "DZ"){
					// 	  index = i;
					// 	  return i;
					// 	}
					//   });
					// console.log(filteredObj);
					
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