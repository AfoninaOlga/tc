let  highlightState = {
	canton_id: -1,
	grape_id: -1,
	index: Number.MAX_SAFE_INTEGER,
}

let map = L.map('map', { zoomControl: false}).setView([48.091, -2.8], 8.75)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
	'pk.eyJ1IjoicXVvcXFhIiwiYSI6ImNrc3N6YTNuYTA3ZncydmxzMmE0azA5MnoifQ.I_BvYr1t2cnV2xqyWpkZrw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> '
			+ 'contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/dark-v10',
		tileSize: 512,
		zoomOffset: -1,
	}).addTo(map);

L.control.zoom({
    position: 'bottomleft'
}).addTo(map);


let geojson;
function get_geojson() {
	$.getJSON("static/bretagne.json", function (data) {
		geojson = L.geoJson(data, {
			style: style,
			onEachFeature: onEachFeature
		}).bindPopup(function (layer) {
			return get_popup_content(layer.feature.properties.code);
		}).addTo(map);
	});
}

get_geojson();


let info = L.control();
info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
};

info.update = function (code) {
	let html = '<b>Canton name</b><br/> Hover over a canton';
	if (code) {
    	html = `${get_canton_data(code)} Click canton to see more information<br>`;
	}

	this._div.innerHTML = '<h4>Bretagne canton data</h4>' +  html;
};

info.addTo(map);

function style(feature) {
	return {
		weight: 1,
		opacity: 1,
		color: 'white',
		dashArray: '',
		fillOpacity: 0.4,
		fillColor: get_color(feature.properties.code),
	};
}

function highlightOnClick(e) {
	let layer = e.target;
	highlightState.canton_id = parseInt(layer.feature.properties.code);
	geojson.resetStyle();
	layer.setStyle({
		weight: 4,
       	color: 'darkred',
		fillColor: 'red',
       	dashArray: '',
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

function mouseOut(e) {
	e.target.setStyle({
		weight: 1,
		fillOpacity: 0.4,
       	color: 'white',
       	dashArray: '',
	});
	info.update();
}

function highlightOnMouseOver(e) {
	let layer = e.target;

	layer.setStyle({
		weight: 4,
		fillOpacity: 0.6,
       	color: 'darkred',
       	dashArray: '',
	});

	info.update(layer.feature.properties.code);

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightOnMouseOver,
		mouseout: mouseOut,
		click: highlightOnClick
	});
}

function get_popup_content(code) {
	let popup_content = "";
	popup_content += get_canton_data(code);
	popup_content += get_grape_data(code);
	return popup_content;
}

function get_color(code) {
	if (parseInt(code) === highlightState.canton_id) {
		return 'red';
	}

	if (highlightState.index < parseInt(indexes[code]) && parseInt(indexes[code]) <= highlightState.index + 20) {
		return 'maroon';
	}

	if (grape_cantons.includes(parseInt(code))) {
		return 'maroon';
	}

	return 'white';
}
