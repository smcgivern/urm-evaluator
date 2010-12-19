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
        assert(arrayEqual(t([2, 3, 4], 5, 2, 1), [[2, 2, 4], 5]));
        assert(arrayEqual(t([2, 3, 4], 6, 2, 5), [[2, 0, 4], 6]));
    }},

    testJump: function() { with(this) {
        assert(arrayEqual(j([2, 2, 4], 1, 1, 2, 5), [[2, 2, 4], 5]));
        assert(arrayEqual(j([2, 2, 4], 1, 1, 3, 5), [[2, 2, 4], 1]));
    }},

    // http://planetmath.org/?op=getobj&from=objects&id=11933
    testRunURM: function() { with(this) {
        var additionProgram = [
            [j, [2, 3, 5]],
            [s, [1]],
            [s, [3]],
            [j, [1, 1, 1]],
            [z, [3]]
        ];

        var transferProgram = [
            [j, [3, 4, 6]],
            [z, [4]],
            [s, [4]],
            [j, [3, 4, 6]],
            [j, [3, 3, 3,]]
        ];

        var infiniteProgram = [[j, [1, 1, 1]]];

        assert(arrayEqual(runURM(additionProgram, [3, 2], 1, []).pop(),
                          ['STOP', 5, 2, 0]));

        assert(arrayEqual(runURM(additionProgram, [4, 5, 0, 0], 1, []).pop(),
                          ['STOP', 9, 5, 0, 0]));

        assert(arrayEqual(runURM(transferProgram, [0, 0, 9, 7], 1, []).pop(),
                          ['STOP', 0, 0, 9, 9]));

        assert(arrayEqual(runURM(infiniteProgram, [0], 1, []).pop(),
                          ['STOP', 'No end after 1000 steps']));
    }},

    testFillZeroes: function() { with(this) {
        var sparseArray = [1];
        sparseArray[3] = 1;

        assert(arrayEqual(fillZeroes([[1], [2, 3]]), [[1, 0], [2, 3]]));

        assert(arrayEqual(fillZeroes([sparseArray, [1, 2]]),
                          [[1, 0, 0, 1], [1, 2, 0, 0]]));
    }},

    testTexFormat: function() { with(this) {
        assert(texFormat([['STOP']]) == '\\text{STOP}');
        assert(texFormat([[1, 2], [3]]) == '1 & 2 \\\\\n3 & 0');

        assert(texFormat([['a'], [2, 'c']]) ==
               '\\text{a} & 0 \\\\\n2 & \\text{c}');
    }},

    testPlainTextFormat: function() { with(this) {
        assert(plainTextFormat([['STOP']]) == 'STOP');
        assert(plainTextFormat([[1, 2], [3]]) == '1\t2\n3\t0');
        assert(plainTextFormat([['a'], [2, 'c']]) == 'a\t0\n2\tc');
    }},
});
