// blindly copied from heim source code, MIT by euphoria.
function hueHash(text, offset = 0) {
	// DJBX33A-ish ... color encryption?
	let val = 0
	for (let i = 0; i < text.length; i++) {
		// scramble char codes across [0-255]
		// prime multiple chosen so @greenie can green, and @redtaboo red.
		const charVal = (text.charCodeAt(i) * 439) % 256

		// multiply val by 33 while constraining within signed 32 bit int range.
		// this keeps the value within Number.MAX_SAFE_INTEGER without throwing out
		// information.
		const origVal = val
		val = val << 5
		val += origVal

		// add the character information to the hash.
		val += charVal
	}

	// cast the result of the final character addition to a 32 bit int.
	val = val << 0 // wait that works?

	// add the minimum possible value, to ensure that val is positive (without
	// throwing out information).
	val += 2147483648

	// add the calibration offset and scale within 0-254 (an arbitrary range kept
	// for consistency with prior behavior).
	return (val + offset) % 255 / 255 // needed [0..1] range lol.
}

// From http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion obviously.
function hslToRgb(h, s, l) {
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		var hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// converting the hsl to hex
function color(text) {
	// I'm assuming the thing won't ever return 1
	const blah = hslToRgb(hueHash(text), 0.65, 0.85)
	let result = ""
	blah.forEach(pew => result += pew.toString(16))
	return '#' + result
}

module.exports = color