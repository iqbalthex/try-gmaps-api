const fields = ["name", "geometry"];
let map, service, marker;

window.initMap = function(){
	const center = new google.maps.LatLng(-6.9, 112.195);

	map = new google.maps.Map(
		document.getElementById("map"), {
			center, zoom: 16, disableDefaultUI: true,
		}
	);
	service = new google.maps.places.PlacesService(map);
	marker = new google.maps.Marker({map});

	const searchInput = document.createElement("div");
	searchInput.style.marginTop = "1rem";
	searchInput.style.display = "flex";
	searchInput.style.gap = "0.5rem";
	searchInput.innerHTML = `<input id="searchInput" type="text"
		placeholder="Masukkan kata kunci..." autofocus />
		<button id="searchButton">Cari</button>
	`;

	map.controls[google.maps.ControlPosition.TOP_CENTER]
		.push(searchInput);

	setTimeout(() => {
		document.getElementById("search").onkeydown = event => {
			(event.key === "Enter") && search(event.target);
		};
	}, 2000);
}

function search(element){
	query = element.value || "";

	try{
		service.findPlaceFromQuery({query, fields}, results => {
			const position = results[0].geometry.location;

			map.setCenter(position);
			marker.setPosition(position);
		});
	} catch {
		alert("Masukkan kata kunci terlebih dahulu!");
	}
}
