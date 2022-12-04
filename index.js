// mengambil elemen-elemen (daftar lokasi)
const places = document.querySelectorAll("a[data-lat][data-lng]");

// posisi awal
const pusat = { lat: 0.476818, lng: 101.379758 };

// inisiasi objek
let infoWindow, trafficLayer, map, marker;
let favContainer, favHeight, favItems, favCollapsed = true;
let favList = [];

// fungsi untuk memunculkan peta
window.initMap = function(){
	// membuat peta
	map = new google.maps.Map(document.getElementById("map"), {
		center: pusat, zoom: 18, mapTypeId: "terrain", disableDefaultUI: true,
	});

	map.addListener('click', e => {
		const lat = e.latLng.lat();
		const lng = e.latLng.lng();

		const content = `<div id="place-info" class="p-3">
			<button class="btn btn-primary mt-2 mb-1"
				data-lat="${lat}"
				data-lng="${lng}"
				data-bs-toggle="modal"
				data-bs-target="#modal"
				onclick="addPlace()">Tambahkan tempat</button>
		</div>`;
		updateInfo({ lat: lat + 0.0002, lng }, content);
	});

	// membuat beberapa objek
	infoWindow = new google.maps.InfoWindow({ content: "", });
	marker = new google.maps.Marker({map});

2650
	// memberikan fungsi agar ketika list tempat diklik, ...
	places.forEach(place => {
		place.onclick = e => {
			const placeName = e.target.innerText;
			let { lat, lng } = e.target.dataset; // mengambil nilai di elemen html
			lat = parseFloat(lat);
			lng = parseFloat(lng);
			map.setCenter({ lat, lng }); // ... fokus ke posisi tempat tersebut

			const content = `<div id="place-info" class="p-3">
				<h5>${place.innerText}</h5>
				<p class="mt-1"><span class="ps-2">Lintang</span><span>: ${lat}</span></p>
				<p class="mb-1"><span class="ps-2">Bujur</span><span>: ${lng}</span></p>
				<button class="btn btn-primary mt-2 mb-1"
					data-lat="${lat}"
					data-lng="${lng}"
					data-name="${placeName}"
					onclick="addFav(this)">Tambah ke favorit</button>
			</div>`;

			updateInfo({ lat: lat + 0.0002, lng }, content);
			marker.setPosition({ lat, lng }); // memindahkan marker
		};
	});

	// membuat dan menambahkan tombol ke peta
	const locateBtn = document.createElement("button");
	locateBtn.classList.add("btn")
	locateBtn.classList.add("bg-info")
	locateBtn.classList.add("mt-2")
	locateBtn.textContent = "Cari lokasi Anda";
	locateBtn.onclick = locate;

	map.controls[google.maps.ControlPosition.TOP_CENTER].push(locateBtn);

	const favPlace = document.createElement("div");
	favPlace.classList.add("position-absolute");
	favPlace.classList.add("fs-5");
	favPlace.classList.add("mt-2");
	favPlace.classList.add("me-2");
	favPlace.innerHTML = `<div>
		<button id="favToggler" class="btn bg-warning m-0" onclick="favToggle">Lokasi favorit</button>
		<div class="position-absolute" style="right: 0">
			<div class="list-group position-relative bg-info"></div>
		</div>
	</div>`;

	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(favPlace);

	setTimeout(() => {
		// document.querySelector(".gm-fullscreen-control").style.top = 0;
		// favPlace.style.transform = "translateX(calc(-46px - 0.5rem))";
		favContainer = document.querySelector("#favToggler + div");
		favItems = document.querySelector("#favToggler + div > div.list-group");

		favHeight = favItems.clientHeight;
		favContainer.style.height = favHeight;
		favItems.style.height = '0';

		favToggler.onclick = favToggle;
	}, 3000);
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
		}, () => locateError(true, map.getCenter()));
	} else {
		locateError(false, map.getCenter());
	}
}


// fungsi yang dijalankan ketika gagal mencari lokasi pengguna
function locateError(browserHasGeolocation, pos){
	updateInfo(pos, browserHasGeolocation
		? "<h5>Error: The Geolocation service failed.</h5>"
		: "<h5>Error: Your browser doesn't support geolocation.</h5>"
	);
}


// fungsi sebagai saklar style tempat favorit
function favToggle(){
	favCollapsed = !favCollapsed;
	if(favCollapsed){
		favItems.style.opacity = '0';
		favItems.style.height = '0';
	} else {
		favItems.style.opacity = '1';
		favItems.style.height = `${favHeight}px`;
	}
}


// menambahkan tempat ke daftar favorit
function addFav(el){
	const { name, lat, lng } = el.dataset;
	favList.push({ name, lat, lng });
	const items = favList.filter((v,i,a) => a.findIndex(v2 => ['name'].every(k => v2[k] === v[k])) === i);

	let content = '';
	items.forEach(e => {
		content += `<a class="list-group-item bg-info px-2 py-0">${e.name}</a>`;
	});
	favItems.innerHTML = content;

	favItems.style.height = 'initial';
	favHeight = favItems.clientHeight;
	favItems.style.height = `${favHeight}px`;
}
