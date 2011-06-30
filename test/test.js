// http://stackoverflow.com/questions/1773069/using-jquery-to-compare-two-arrays/1773172#1773172
function arrayEqual(x, y) {
    if (x.length != y.length) { return false; }

    var a = x.sort();
    var b = y.sort();

    for (var i = 0; i < a.length; i++) {
        if (typeof a[i] == 'undefined' && typeof b[i] == 'undefined') {
            continue;
        } else if (typeof a[i] == 'undefined' || typeof b[i] == 'undefined') {
            return false;
        } else if (a[i].constructor == Array && b[i].constructor == Array) {
            if (!arrayEqual(a[i], b[i])) { return false ;}
        } else {
            if (a[i] !== b[i]) { return false; }
        }
    }

    return true;
};

// http://planetmath.org/?op=getobj&from=objects&id=11933
var additionProgram = [
    [allInstructions['j'], [2, 3, 5]],
    [allInstructions['s'], [1]],
    [allInstructions['s'], [3]],
    [allInstructions['j'], [1, 1, 1]],
    [allInstructions['z'], [3]],
];

var transferProgram = [
    [allInstructions['j'], [3, 4, 6]],
    [allInstructions['z'], [4]],
    [allInstructions['s'], [4]],
    [allInstructions['j'], [3, 4, 6]],
    [allInstructions['j'], [3, 3, 3,]],
];

var infiniteProgram = [[allInstructions['j'], [1, 1, 1]]];

new Test.Unit.Runner({
    setup: function() {
    },

    teardown: function() {
    },

    testZero: function() { with(this) {
        assert(arrayEqual(z([2, 3, 4], 1, 1), [[0, 3, 4], 1]));
        assert(arrayEqual(z([2, 3, 4], 2, 5), [[2, 3, 4, , 0], 2]));
    }},

    testSuccessor: function() { with(this) {
        assert(arrayEqual(s([2, 3, 4], 3, 1), [[3, 3, 4], 3]));
        assert(arrayEqual(s([2, 3, 4], 4, 5), [[2, 3, 4, , 1], 4]));
    }},

    testTransfer: function() { with(this) {
        assert(arrayEqual(t([2, 3, 4], 5, 2, 1), [[3, 3, 4], 5]));
        assert(arrayEqual(t([2, 3, 4], 6, 5, 2), [[2, 0, 4], 6]));
    }},

    testJump: function() { with(this) {
        assert(arrayEqual(j([2, 2, 4], 1, 1, 2, 5), [[2, 2, 4], 5]));
        assert(arrayEqual(j([2, 2, 4], 1, 1, 3, 5), [[2, 2, 4], 1]));
    }},

    testRunURM: function() { with(this) {
        assert(arrayEqual(runURM(additionProgram, [3, 2], 1, []).pop(),
                          ['STOP', 5, 2, 0]));

        assert(arrayEqual(runURM(additionProgram, [4, 5, 0, 0], 1, []).pop(),
                          ['STOP', 9, 5, 0, 0]));

        assert(arrayEqual(runURM(transferProgram, [0, 0, 9, 7], 1, []).pop(),
                          ['STOP', 0, 0, 9, 9]));

        assert(arrayEqual(runURM(infiniteProgram, [0], 1, []).pop(),
                          ['STOP', 'No end after 1000 steps']));
    }},

    testDisplayURM: function() { with(this) {
        var additionProgramText = [
            'J(2, 3, 5)', 'S(1)', 'S(3)', 'J(1, 1, 1)', 'Z(3)'
        ].join('\n');

        var transferProgramText = [
            'J(3, 4, 6)', 'Z(4)', 'S(4)', 'J(3, 4, 6)', 'J(3, 3, 3)',
        ].join('\n');

        var infiniteProgramText = 'J(1, 1, 1)';

        assert(displayURM(additionProgram) == additionProgramText);
        assert(displayURM(transferProgram) == transferProgramText);
        assert(displayURM(infiniteProgram) == infiniteProgramText);
    }},

    testParseURM: function() { with(this) {
        var resultProgram = [
            [allInstructions['j'], [2, 3, 5]],
            [allInstructions['s'], [1]],
            [allInstructions['s'], [3]],
            [allInstructions['j'], [1, 1, 1]],
            [allInstructions['z'], [3]],
            [allInstructions['t'], [1, 3]],
            [allInstructions['t'], [1, 3]],
        ];

        var inputProgram = [
            'jump(2, 3, 5)',
            '',
            'gaps and invalid lines ignored',
            'zero(5, 6, 7)',
            'successor(1)',
            'S3',
            'JIMP(1, 1, 1)',
            'zoo3',
            'copy 1\t3',
            'T(1, 3)',
        ].join('\n');

        assert(arrayEqual(parseURM(inputProgram), resultProgram));
    }},

    testFillZeroes: function() { with(this) {
        var sparseArray = [1];
        sparseArray[3] = 1;

        assert(arrayEqual(fillZeroes([[1], [2, 3]]), [[1, 0], [2, 3]]));

        assert(arrayEqual(fillZeroes([sparseArray, [1, 2]]),
                          [[1, 0, 0, 1], [1, 2, 0, 0]]));
    }},

    testTexFormat: function() { with(this) {
        assert(texFormat([['STOP']]) ==
               '\\text{Instruction} \\\\\n\\text{STOP}');

        assert(texFormat([[1, 2], [3]]) ==
               '\\text{Instruction} & r_1 \\\\\n1 & 2 \\\\\n3 & 0');

        assert(texFormat([['a'], [2, 'c']]) ==
               '\\text{Instruction} & r_1 \\\\\n\\text{a} & 0 \\\\\n2 & \\text{c}');
    }},

    testPlainTextFormat: function() { with(this) {
        assert(plainTextFormat([['STOP']]) == 'Instruction\nSTOP');
        assert(plainTextFormat([[1, 2], [3]]) ==
               'Instruction\tr_1\n1\t2\n3\t0');

        assert(plainTextFormat([['a'], [2, 'c', 'd']])
               == 'Instruction\tr_1\tr_2\na\t0\t0\n2\tc\td');
    }},

    testAddHeaderRow: function() { with(this) {
        var defaultFunction = function(i) { return 'r_' + i; }
        var identityFunction = function(i) { return '' + i; }

        assert(arrayEqual([['Instruction'], []], addHeaderRow([[]])));

        assert(arrayEqual([['Instruction', 'r_1', 'r_2', 'r_3'], [0, 0, 0, 0]],
                          addHeaderRow([[0, 0, 0, 0]], defaultFunction)));

        assert(arrayEqual([['Instruction', '1', '2'], [0, 0, 0]],
                          addHeaderRow([[0, 0, 0]], identityFunction)));
    }},
});
