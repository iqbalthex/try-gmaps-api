// mengambil elemen-elemen (daftar lokasi)
const places = document.querySelectorAll("a[data-lat][data-lng]");

// posisi awal
const pusat = { lat: 0.476818, lng: 101.379758 };

// inisiasi objek
let infoWindow, trafficLayer, map, marker;
let favItems, favCollapsed = false;
let favList = [];

if(!localStorage.getItem("myMap")){
	const datas = JSON.stringify({ favPlaces:[] });
	localStorage.setItem("myMap", datas);
}

let datas = JSON.parse(localStorage.getItem("myMap"));


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
				onclick="addFav()">Tambah ke favorit</button>
		</div>`;
		updateInfo({ lat: lat + 0.0002, lng }, content);
	});

	infoWindow = new google.maps.InfoWindow({ content: "", });
	marker = new google.maps.Marker({map});

	// memberikan fungsi ketika list tempat diklik
	places.forEach(place => {
		place.onclick = e => {
			const name = place.innerText;
			let { lat, lng } = e.target.dataset; // mengambil nilai di elemen html
			lat = parseFloat(lat);
			lng = parseFloat(lng);
			map.setCenter({ lat, lng });

			const placeNames = favList.map(e => e.name);

			let content = `<div id="place-info" class="p-3">
				<h5>${place.innerText}</h5>
				<p class="mt-1"><span class="ps-2">Lintang</span><span>: ${lat}</span></p>
				<p class="mb-1"><span class="ps-2">Bujur</span><span>: ${lng}</span></p>
			`;

			const inList = favList.filter(e => e.name === name).length == 1;
			if(inList){
				content += `<button id="delBtn"
					class="btn btn-primary mt-2 mb-1"
					data-name="${name}"
					onclick="delFav(this)">Hapus dari favorit
				</button>`;
			} else {
				content += `<button id="addBtn"
					class="btn btn-primary mt-2 mb-1"
					data-lat="${lat}"
					data-lng="${lng}"
					data-name="${name}"
					onclick="addFav(this)">Tambah ke favorit
				</button>`;
			}

			content += '</div>';

			updateInfo({ lat: lat + 0.0002, lng }, content);
			marker.setPosition({ lat, lng });
		};
	});

	const favPlace = document.createElement("div");
	favPlace.classList.add("position-absolute");
	favPlace.classList.add("fs-5");
	favPlace.classList.add("mt-2");
	favPlace.classList.add("me-2");

	favList = datas.favPlaces;
	let cont = `<div>
		<button id="favToggler" class="btn bg-warning m-0" onclick="favToggle">Lokasi favorit</button>
		<div class="position-absolute" style="right: 0">
			<div class="list-group position-relative bg-info">
	`;

	favList.forEach(e => {
		cont += `<a class="list-group-item bg-info px-2 py-0">${e.name}</a>`
	});

	cont += '</div></div></div>';

	favPlace.innerHTML = cont;

	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(favPlace);

	setTimeout(() => {
		favItems = document.querySelector("#favToggler + div > div.list-group");
		document.getElementById("favToggler").onclick = favToggle;
	}, 2000);
};


// fungsi untuk mengubah infoWindow
function updateInfo(pos, content){
	infoWindow.setPosition(pos);
	infoWindow.setContent(content);
	infoWindow.open(map);
}


// fungsi untuk memperbarui daftar tempat favorit
function updateList(){
	const items = favList.filter((v,i,a) => a.findIndex(v2 => ['name'].every(k => v2[k] === v[k])) === i);
	datas.favPlaces = items;
	localStorage.setItem("myMap", JSON.stringify(datas));

	let content = '';
	items.forEach(e => {
		content += `<a class="list-group-item bg-info px-2 py-0">${e.name}</a>`;
	});
	favItems.innerHTML = content;
}


// fungsi untuk memunculkan/menyembunyikan daftar tempat favorit
function favToggle(){
	favCollapsed = !favCollapsed;
	favItems.style.opacity = favCollapsed ? '0' : '1';
}


// menambahkan tempat ke daftar favorit
function addFav(el){
	const { name, lat, lng } = el.dataset;
	favList.push({ name, lat, lng });

	updateList();
}


// menghapus tempat dari daftar favorit
function delFav(el){
	const { name, lat, lng } = el.dataset;
	favList = favList.filter(e => e.name !== name);

	updateList();
}
