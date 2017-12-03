
// Author: Peter Olson
// Source: https://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
function toRadians (angle) {
	return angle * (Math.PI / 180);
}

function toDegrees (angle) {
	return angle * (180 / Math.PI);
}

function airline_dictionary(name) {
	switch(name.toLowerCase()) {
		case 'american': return 'AAL';
		case 'delta': return 'DAL';
		case 'jetblue': return 'JBU';
		case 'southwest': return 'SWA';
		case 'lot': return 'LOT';
		default: return false;
	}
}

function get_random_airline() {
	var airlines = ['AAL', 'DAL', 'JBU', 'SWA', 'LOT'];
	return airlines[parseInt(Math.random() * airlines.length)];
}

// Author: Pointy
// Source: https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}