// navigator.geolocation for current user location
// var x = document.getElementById("demo");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else { 
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

// function showPosition(position) {
//   x.innerHTML = "Latitude: " + position.coords.latitude + 
//   "<br>Longitude: " + position.coords.longitude;
// }


// initialise map

var map = L.map( 'mapid');
map.locate({setView: true, maxZoom: 5});

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo( map );

// Ajax

$('#btnRun').click(function() {
	

	$.ajax({
		url: "libs/php/getInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
            // iso_a2: "GB"
        },
		success: function(result) {

			console.log(result);

			if (result.status.name == "ok") {

				// $('#selection').html("hi");
				// $('#demo').html(result['data']);
				// $('#txtLongitude1').html(result['data']['lng']);
				// $('#txtTimezone1').html(result['data']['timezoneId']);

			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("error");
			console.log(result['data']);
		}
	}); 


});















// preloader

$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});