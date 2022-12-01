// mengambil elemen-elemen (daftar lokasi)
const places = document.querySelectorAll("a[data-lat][data-lng]");

// posisi awal
const pusat = { lat: 0.476818, lng: 101.379758 };

// inisiasi objek
let infoWindow, trafficLayer, map, marker;


// fungsi untuk memunculkan peta
window.initMap = function(){
	// membuat peta
	map = new google.maps.Map(document.getElementById("map"), {
		center: pusat, zoom: 18, mapTypeId: "hybrid",
	});

	// membuat beberapa objek
	infoWindow = new google.maps.InfoWindow({ content: "", });
	marker = new google.maps.Marker({map});
	trafficLayer = new google.maps.TrafficLayer();

	// menambahkan objek peta lalu lintas
  trafficLayer.setMap(map);
2650
	// memberikan fungsi agar ketika list tempat diklik, ...
	places.forEach(place => {
		place.onclick = e => {
			let { lat, lng } = e.target.dataset; // mengambil nilai di elemen html
			lat = parseFloat(lat);
			lng = parseFloat(lng);
			map.setCenter({ lat, lng }); // ... fokus ke posisi tempat tersebut

			const content = `<div id="place-info" class="p-2">
				<h5>${place.innerText}</h5>
				<p class="mt-1"><span class="ps-2">Lintang</span><span>: ${lat}</span></p>
				<p class="mb-1"><span class="ps-2">Bujur</span><span>: ${lng}</span></p>
				<button class="btn btn-primary mt-2 mb-1">Tambah ke favorit</button>
			</div>`;

			updateInfo({ lat: lat + 0.0002, lng }, content);
			marker.setPosition({ lat, lng }); // memindahkan marker
		};
	});

	// membuat tombol
	const locateBtn = document.createElement("button");
	locateBtn.classList.add("btn")
	locateBtn.classList.add("bg-info")
	locateBtn.textContent = "Cari lokasi Anda";
	locateBtn.onclick = locate;

	// menambahkan tombol ke bagian atas peta
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(locateBtn);
};


// fungsi untuk mengubah infoWindow
function updateInfo(pos, content){
	infoWindow.setPosition(pos);
	infoWindow.setContent(content);
	infoWindow.open(map);
}


// fungsi untuk mencari lokasi pengguna
function locate(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(position => {
			const lat = position.coords.latitude;
			const lng = position.coords.longitude;
			map.setCenter({ lat, lng });

			updateInfo({ lat, lng }, "<h5 class='bg-info p-2'>Anda sekarang disini</h5>");
		}, () => locateError(true, infoWindow, map.getCenter()));
	} else {
		locateError(false, infoWindow, map.getCenter());
	}
}


// fungsi yang dijalankan ketika gagal mencari lokasi pengguna
function locateError(browserHasGeolocation, infoWindow, pos){
	updateInfo(pos, browserHasGeolocation
		? "<h5>Error: The Geolocation service failed.</h5>"
		: "<h5>Error: Your browser doesn't support geolocation.</h5>"
	);
}
