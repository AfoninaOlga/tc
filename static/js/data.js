function get_grape_data(code) {
	var res = "";
    $.getJSON({
        url: `${window.location.href}grape/${code}`,
		async: false,
        success: function(data) {
			$.each( data, function(key, grape) {
            	res += `<li> ${grape['name']} (${grape["berry_color"]},`
						+ `${grape["disease_resistance"].toLowerCase()}, `
						+ `${grape["use_direction"]}, ${grape["origin"]})</li>`;
			});
        }
    });
    return res;
}

function get_canton_data(code) {
    var res = "";
    $.getJSON({
        url: `${window.location.href}canton/${code}`,
		async: false,
        success: function(data) {
            res += `<b>${data['name']}</b><br>`;
			res += `terroir index: ${data['terroir_index']}<br>`;
        }
    });
    return res;
}

function get_canton_names() {
	let names = [];
	$.getJSON({
		url: `${window.location.href}names`,
		async: false,
		success: function(data) {
			names = data;
		}
	});
	return names;
}

function get_canton_by_grape(grape_id) {
	if (parseInt(grape_id) === -1) {
		return [];
	}
	let cantons = [];
	$.getJSON({
		url: `${window.location.href}cantons/${grape_id}`,
		async: false,
		success: function(data) {
			$.each( data, function(key, val) {
				cantons.push(val['canton_id']);
			});
		}
	});
	return cantons;
}

function get_indexes() {
	let indexes = []
	$.getJSON({
		url: window.location.href + 'indexes',
		async: false,
		success: function (data) {
			$.each(data, function (key, val) {
				indexes[key] = val;
			});
		}
	});
	return indexes;
}

function get_grapes() {
	let grapes = []
	$.getJSON({
		url: window.location.href + 'grapes',
		async: false,
		success: function (data) {
			grapes = data;
		}
	});
	return grapes;
}

let indexes = get_indexes();
let grape_cantons = [];