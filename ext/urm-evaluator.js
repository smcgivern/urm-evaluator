var z = replaceIndex(zero);
var s = replaceIndex(successor);
var t = replaceIndex(transfer);

function j(registers, next, m, n, p) {
    return [registers, registers[m - 1] == registers[n - 1] ? p : next];
}

var stepLimit = 1000;
var allInstructions = {
    'z': {'function': z, 'arguments': 1, 'names': ['zero']},
    's': {'function': s, 'arguments': 1, 'names': ['successor']},
    't': {'function': t, 'arguments': 2, 'names': ['transfer', 'copy']},
    'j': {'function': j, 'arguments': 3, 'names': ['jump']}
};

function zero(registers, n) { return 0; }
function successor(registers, n) { return orZero(registers, n - 1) + 1; }
function transfer(registers, n, m) { return orZero(registers, m - 1); }
function orZero(arr, i) { return parseInt('0' + arr[i], 10); }

function replaceIndex(func, name) {
    var newFunction = function(registers, next, n, m) {
        var newRegisters = registers.slice(0);
        newRegisters[n - 1] = func(registers, n, m);

        return [newRegisters, next];
    };

    newFunction.prototype.name = name;
    return newFunction;
}

function runURM(program, registers, i, log) {
    function newLog(x) { return log.concat([[x].concat(registers)]); }

    if (log.length >= stepLimit) {
        return log.concat([['STOP',
                            'No end after ' + stepLimit + ' steps']]);
    }

    if (i > program.length) { return newLog('STOP'); }

    var args = [registers, i + 1].concat(program[i - 1][1]);
    var result = program[i - 1][0]['function'].apply(this, args);

    return runURM(program, result[0], result[1], newLog(i));
}

function displayURM(program) {
    function displayURMLine(line) {
        return line[0].names[0].charAt(0).toUpperCase() +
            '(' + line.slice(1)[0].join(', ') + ')';
    }

    return $.map(program, displayURMLine).join('\n');
}

function parseURM(text) {
    var program = [];
    var lines = text.split(/\n+/);

    $.each(lines, function(i, line) {
        var args = line.match(/[0-9]+/g);

        for (var i in allInstructions) {
            var match = $.grep(allInstructions[i]['names'], function(name) {
                var firstLetter = line.match(/[A-z]/);

                return (firstLetter &&
                        name.charAt(0) == firstLetter.toString().toLowerCase());
            });

            if (match[0]) { var instruction = allInstructions[i]; break; }
        };

        if (instruction && args && args.length == instruction['arguments']) {
            program.push([instruction,
                          $.map(args, function(x) { return parseInt(x, 10); })
                         ]);
        }
    });

    return program;
}

function fillZeroes(lines) {
    function orZeroMap(length) {
        return function(array) {
            var newArray = array.slice(0);

            for (var i = 0; i < length; i++) {
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
    function texFormatLine(line, i) {
        return $.
            map(line, function(cell, j) {
                return ((typeof cell == 'string' && cell.charAt(0) != 'r') ?
                        '\\text{' + cell + '}' : '' + cell)
            }).join(' & ');
    }

    var filledLines = addHeaderRow(fillZeroes(lines),
                                   function(i) { return 'r_' + i; });

    return $.map(filledLines, texFormatLine).join(' \\\\\n');
}

function plainTextFormat(lines) {
    function plainTextFormatLine(l) { return l.join('\t'); }

    var filledLines = addHeaderRow(fillZeroes(lines),
                                   function(i) { return 'r_' + i; });

    return $.map(filledLines, plainTextFormatLine).join('\n');
}

function addHeaderRow(lines, func) {
    var header = ['Instruction'];

    for (var i = 1; i < lines[0].length; i++) { header.push(func(i)); }

    return [header].concat(lines);
}
