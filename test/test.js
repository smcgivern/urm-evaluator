// http://stackoverflow.com/questions/1773069/using-jquery-to-compare-two-arrays/1773172#1773172
function arrayEqual(x, y) {
    if (x.length != y.length) { return false; }

    var a = x.sort();
    var b = y.sort();

    for (var i = 0; b[i]; i++) {
        if (a[i].constructor == Array && b[i].constructor == Array) {
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
		assert(arrayEqual(zero([2, 3, 4], 1), [0, 3, 4]));
		assert(arrayEqual(zero([2, 3, 4], 5), [2, 3, 4, , 0]));
	}},

	testSuccessor: function() { with(this) {
		assert(arrayEqual(successor([2, 3, 4], 1), [3, 3, 4]));
		assert(arrayEqual(successor([2, 3, 4], 5), [2, 3, 4, , 1]));
	}},

	testCopy: function() { with(this) {
		assert(arrayEqual(copy([2, 3, 4], 2, 1), [2, 2, 4]));
		assert(arrayEqual(copy([2, 3, 4], 2, 5), [2, 0, 4]));
	}},

	testJump: function() { with(this) {
	}},

	testTexFormat: function() { with(this) {
		assert(texFormat([['STOP']]) == 'STOP');
		assert(texFormat([[1, 2], [3]]) == "1 & 2 \\\\\n3");
		assert(texFormat([['a'], ['b', 'c']]) == "a \\\\\nb & c");
	}},
});
