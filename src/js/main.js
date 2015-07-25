
$(document).ready(function() {
// ------------------------------------------------------------------------------------
  
/* ===== Initialization of the plugins: ===== */

/* ----- #SLICK-NAV ----- */

$('#menu').slicknav({
	label: '',
	prependTo:'.header-nav .container'
});

/* ===== Write You code in here: ===== */

/* ----- MODAL WINDOW ----- */
  
$('body').append('<div id="overlay"></div>');

$('button#call').click( function(event) { // ловим клик по кнопке с id="call"
    event.preventDefault(); // выключаем стандартную роль элемента
    $('#overlay').fadeIn(400,
        function() {
            $('.feedback__form-popup')
                .css('display', 'block')
                .animate({opacity: 1}, 200);
        }
    );
});

$('#overlay, #close').click( function() {
    $('.feedback__form-popup')
        .animate({opacity: 0}, 200,
            function() {
                $(this).css('display', 'none');
                $('#overlay').fadeOut(400);
            }
        );
});

/* ----- GOOGLE MAP ----- */
 
google.maps.event.addDomListener(window, 'load', init);
var map;
function init() {
	var mapOptions = {
    	center: new google.maps.LatLng(50.19,35.5),
    	zoom: 10,
    	zoomControl: true,
    	zoomControlOptions: {
    		style: google.maps.ZoomControlStyle.LARGE,
    		position: google.maps.ControlPosition.TOP_LEFT
    	},
    	panControl: true,
    	mapTypeControl: true,
    	scaleControl: true,
    	disableDoubleClickZoom: false,
    	scrollwheel: false,
    	streetViewControl: false,
    	draggable : true,
    	overviewMapControl: true,
    	overviewMapControlOptions: {
    	    opened: false
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var mapElement = document.getElementById('map-canvas');
	var map = new google.maps.Map(mapElement, mapOptions);
	var locations = [
		['Богодухов',
		 'Здесь я обитаю',
		 'undefined', 
		 'undefined', 
		 'undefined', 
		 50.165, 
		 35.52, 
		 'https://mapbuildr.com/assets/img/markers/default.png']
	];
	for (i = 0; i < locations.length; i++) {
		if (locations[i][1] =='undefined'){ description ='';} else { description = locations[i][1];}
		if (locations[i][2] =='undefined'){ telephone ='';} else { telephone = locations[i][2];}
		if (locations[i][3] =='undefined'){ email ='';} else { email = locations[i][3];}
		if (locations[i][4] =='undefined'){ web ='';} else { web = locations[i][4];}
		if (locations[i][7] =='undefined'){ markericon ='';
		} else { 
			markericon = new google.maps.MarkerImage(locations[i][7],
				new google.maps.Size(35, 35)
			);
		};
		var marker = new google.maps.Marker({
			icon: markericon,
			position: new google.maps.LatLng(locations[i][5], locations[i][6]),
			map: map,
			title: locations[i][0],
			desc: description,
			tel: telephone,
			email: email,
			web: web
		});
		var infowindow = new google.maps.InfoWindow({
			content: description
		});
		// google.maps.event.addListener(marker, 'click', function() {
		// 	infowindow.open(map, this);
		// });
	};
};
    
// -------------------------------------------------------------------------------------
});
