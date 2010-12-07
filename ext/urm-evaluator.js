function zero(registers, n) {
	return replaceIndex(registers, n, 0);
}

function successor(registers, n) {
	return replaceIndex(registers, n, orZero(registers, n - 1) + 1);
}

function copy(registers, n, m) {
	return replaceIndex(registers, n, orZero(registers, m - 1));
}

function jump(registers, m, n, q, p) {
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
	return $.
		map(lines, function(l, i) { return l.join(' & '); }).
		join(" \\\\\n");
}
