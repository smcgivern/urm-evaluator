function zero(registers, n) {
	return replaceIndex(registers, n, 0);
}

function successor(registers,, n) {
	return replaceIndex(registers, n, orZero(registers, n - 1) + 1);
}

function transfer(registers, n, m) {
	return replaceIndex(registers, n, orZero(registers, m - 1))];
}

function jump(registers, m, n, p, q) {
}

function orZero(arr, i) {
	return parseInt('0' + arr[i], 10);
}

function replaceIndex(registers, n, m) {
	var newRegisters = registers.slice(0);
	newRegisters[n - 1] = m;
	return newRegisters;
}

function texFormat(lines) {
	var lineTexFormat = function(line, i) {
		return $.
			map(line, function(c, j) {
				return (typeof c == 'string' ?
						'\\text{' + c + '}' : '' + c)
			}).join(' & ');
	}

	return $.map(lines, lineTexFormat).join(' \\\\\n');
}
