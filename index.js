const markers = document.querySelectorAll("a[data-lat][data-lng]");
let infoWindow;
let map;

function initMap(){
	const pusat = { lat: 0.476818, lng: 101.379758 };
	map = new google.maps.Map(document.getElementById("map"), {
		center: pusat,
		zoom: 18,
		mapTypeId: "terrain", // "roadmap" "satellite" "hybrid" "terrain" "coordinate"
	});

	infoWindow = new google.maps.InfoWindow({ content: "", });

	const marker = new google.maps.Marker({
		map, position: pusat,
	});

	const trafficLayer = new google.maps.TrafficLayer();
	// const transitLayer = new google.maps.TransitLayer();
	// const bikeLayer = new google.maps.BicyclingLayer();
  trafficLayer.setMap(map);
  // transitLayer.setMap(map);
	// bikeLayer.setMap(map);



	// const marker = new google.maps.Marker({
		// position: uluru,
		// map: map,
		// label: "AB",
		// title: "Uluru (Ayers Rock)",
	// });

	// const infoWindow = new google.maps.InfoWindow({
		// content: "",
		// disableAutoPan: true,
	// });

	markers.forEach(marker => {
		marker.addEventListener('click', e => {
			let { lat, lng } = e.target.dataset;
			lat = parseFloat(lat);
			lng = parseFloat(lng);
			map.setCenter({ lat, lng });

			const content = `<div id="marker-info">
				<h3>${marker.innerText}</h3>
				<p><span>Lintang</span><span>: ${lat}</span></p>
				<p><span>Bujur</span><span>: ${lng}</span></p>
				<button>Tambah ke favorit</button>
			</div>`;

			infoWindow.setPosition({ lat, lng });
			infoWindow.setContent(content);
			infoWindow.open(map);
		});
	});

	const locateBtn = document.createElement("button");
	locateBtn.textContent = "Pan to Current Location";
	locateBtn.onclick = locate;

	map.controls[google.maps.ControlPosition.TOP_CENTER].push(locateBtn);
}

window.initMap = initMap;

function locate(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(position => {
			const { lat, lng } = position.coords.latitude;
			map.setCenter({ lat, lng });

			infoWindow.setPosition({ lat, lng });
			infoWindow.setContent("Location found.");
			infoWindow.open(map);
		}, () => locateError(true, infoWindow, map.getCenter()));
	} else {
		locateError(false, infoWindow, map.getCenter());
	}
}

function locateError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation
		? "Error: The Geolocation service failed."
		: "Error: Your browser doesn't support geolocation."
	);
	infoWindow.open(map);
}
