var stepLimit = 1000;

var z = replaceIndex(zero);
var s = replaceIndex(successor);
var t = replaceIndex(transfer);

function j(registers, next, m, n, p) {
    return [registers, registers[m - 1] == registers[n - 1] ? p : next];
}

function zero(registers, n) { return 0; }
function successor(registers, n) { return orZero(registers, n - 1) + 1; }
function transfer(registers, n, m) { return orZero(registers, m - 1); }
function orZero(arr, i) { return parseInt('0' + arr[i], 10); }

function replaceIndex(func) {
    return function(registers, next, n, m) {
        var newRegisters = registers.slice(0);
        newRegisters[n - 1] = func(registers, n, m);
        return [newRegisters, next];
    };
}

function runURM(program, registers, i, log) {
    function newLog(x) { return log.concat([[x].concat(registers)]); }

    if (log.length >= stepLimit) {
        return log.concat([['STOP',
                            'No end after ' + stepLimit + ' steps']]);
    }

    if (i > program.length) { return newLog('STOP'); }

    var args = [registers, i + 1].concat(program[i - 1][1]);
    var result = program[i - 1][0].apply(this, args);

    return runURM(program, result[0], result[1], newLog(i));
}

function fillZeroes(lines) {
    function orZeroMap(length) {
        return function(array) {
            var newArray = array.slice(0);
            for (i = 0; i < length; i++) {
                if (typeof newArray[i] != 'string') {
                    newArray[i] = orZero(newArray, i);
                }
            }
            return [newArray];
        };
    }

    var lengths = $.map(lines, function(v, i) { return v.length; });

    return $.map(lines, orZeroMap(Math.max.apply(Math, lengths)));
}

function texFormat(lines) {
    function lineTexFormat(line, i) {
        return $.
            map(line, function(c, j) {
                return (typeof c == 'string' ?
                        '\\text{' + c + '}' : '' + c)
            }).join(' & ');
    }

    return $.map(fillZeroes(lines), lineTexFormat).join(' \\\\\n');
}

function plainTextFormat(lines) {
    function linePlainTextFormat(l) { return l.join('\t'); }

    return $.map(fillZeroes(lines), linePlainTextFormat).join('\n');
}
