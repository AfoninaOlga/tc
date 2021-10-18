function click_grape(grape_id) {
	grape_id = parseInt(grape_id);
	map.closePopup();
	highlightState.grape_id = grape_id === highlightState.grape_id ? -1 : grape_id;
	highlightState.index = Number.MAX_SAFE_INTEGER;
	grape_cantons = get_canton_by_grape(grape_id);
	geojson.setStyle(style);
}

function click_canton_filter(canton_id) {
	map.closePopup();
	highlightState.canton_id = canton_id;
	geojson.setStyle(style);
	info.update(canton_id);
}

function click_index(index) {
	map.closePopup();
	highlightState.index = index === highlightState.index ? Number.MAX_SAFE_INTEGER : index;
	highlightState.grape_id = -1;
	geojson.setStyle(style);
}

function get_grape_dropdown() {
	let html = document.getElementById('grapeDropdown').innerHTML;
	$.each(get_grapes(), function (key, grape) {
		html += `<a id="grape${grape.grape_id}" onclick="click_grape(${grape.grape_id})">`
				+ `${grape.name} (${grape.origin})</a>`;
	});
	return html;
}

function get_canton_dropdown() {
	let cantonHtml = document.getElementById('cantonDropdown').innerHTML;
	let names = get_canton_names();
	$.each(names, function (code, name) {
		cantonHtml += `<a id="canton${code}" onclick="click_canton_filter(${code})"`
			+ `onmouseover="click_canton_filter(${code})"> ${name}</a>`;
	});
	return cantonHtml;
}

function get_index_dropdown() {
	let indexHtml = document.getElementById('indexDropdown').innerHTML;
	for (let index = 0; index < 61; index += 20) {
		indexHtml += `<a id="index${index}" onclick="click_index(${index})"> ${index}&ndash;${index + 20}</a>`;
	}
	return indexHtml;
}

function filterFunction(input_id, dropdown_id) {
  	let input, filter, a, i;
  	input = document.getElementById(input_id);
  	filter = input.value.toUpperCase();
	let div = document.getElementById(dropdown_id);
  	a = div.getElementsByTagName("a");

	let txtValue;
	for (i = 0; i < a.length; i++) {
		txtValue = a[i].textContent || a[i].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
		} else {
			a[i].style.display = "none";
		}
	}
}

document.getElementById('grapeDropdown').innerHTML = get_grape_dropdown();
document.getElementById('cantonDropdown').innerHTML = get_canton_dropdown();
document.getElementById('indexDropdown').innerHTML = get_index_dropdown();
