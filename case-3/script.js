if(!localStorage.getItem("map")){
	localStorage.setItem("map", "[]");
}

const favItems = document.querySelector(".fav-items");
const formPlaceName = document.querySelector("form input[name=placeName]");
const formLat = document.querySelector("form input[name=lat]");
const formLng = document.querySelector("form input[name=lng]");
let datas = JSON.parse(localStorage.getItem("map"));
let infoWindow, trafficLayer, map, marker, markers = [];


window.initMap = function(){
	map = new google.maps.Map(document.getElementById("map"), {
		center: { lat: 0.476818, lng: 101.379758 },
		zoom: 18,
		mapTypeId: "terrain",
		disableDefaultUI: true,
	});

	map.addListener('click', event => {
		const lat = event.latLng.lat();
		const lng = event.latLng.lng();
		formPlaceName.value = "";

		const content = `<div class="place-info" class="p-3">
			<button class="btn btn-warning m-2"
				data-lat="${lat}"
				data-lng="${lng}"
				data-bs-toggle="modal"
				data-bs-target="#modal"
				onclick="">Simpan lokasi</button>
		</div>`;

		formLat.value = lat;
		formLng.value = lng;

		infoWindow.setPosition({ lat: lat + 0.0002, lng });
		infoWindow.setContent(content);
		infoWindow.open(map);
	});

	infoWindow = new google.maps.InfoWindow({ content: "", });
	marker = new google.maps.Marker({map});
	update();

	const menu = document.createElement("div");
	menu.classList.add("mt-2");
	menu.classList.add("ms-2");
	menu.innerHTML = `<button class="btn btn-primary text-center fs-5 position-fixed"
		type="button" data-bs-toggle="offcanvas"
		data-bs-target="#mapMenu">Tempat Tersimpan</button>`;

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(menu);
};


// fungsi untuk memperbarui daftar tempat tersimpan
function update(){
	const items = datas.filter((v,i,a) => a.findIndex(v2 => ['name'].every(k => v2[k] === v[k])) === i);
	datas = items;
	localStorage.setItem("map", JSON.stringify(datas));

	let content = '';
	items.forEach(e => {
		const cont = `<div class="place-info" class="p-3">
			${e.innerText}
		</div>`;

		content += `<li class="list-group-item d-flex justify-content-between px-2 py-0"
			style="background: orange"
			data-lat="${e.lat}"
			data-lng="${e.lng}"
			onclick="focusTo(this)">
			${e.name}
			<a onclick="hapusFavorit('${e.name}')">Hapus</a>
		</li>`;
	});

	favItems.innerHTML = content;
}


// menambahkan tempat ke daftar favorit
function tambahFavorit(){
	const name = formPlaceName.value;
	const lat = formLat.value;
	const lng = formLng.value;
	datas.push({ name, lat, lng });

	update();
}


// menghapus tempat dari daftar favorit
function hapusFavorit(name){
	datas = datas.filter(e => e.name !== name);

	update();
}

function focusTo(elemen){
	const name = elemen.innerText.replace("Hapus","");
	const { lat, lng } = elemen.dataset;
	const content = `<div class="place-info p-3 fs-4">
		<b>${name}</b>
	</div>`;

	infoWindow.setPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
	infoWindow.setContent(content);
	infoWindow.open(map);
}
