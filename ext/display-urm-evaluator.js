var samplePrograms = [
    {'id': 'addition', 'name': 'Addition',
     'description': 'Adds the contents of <i>r</i><sub>1</sub> and <i>r</i><sub>2</sub>',
     'program': [
         [allInstructions['j'], [2, 3, 5]],
         [allInstructions['s'], [1]],
         [allInstructions['s'], [3]],
         [allInstructions['j'], [1, 1, 1]],
         [allInstructions['z'], [2]],
         [allInstructions['z'], [3]]
     ]},
    {'id': 'subtraction', 'name': 'Subtraction',
     'description': 'Subtracts <i>r</i><sub>1</sub> from <i>r</i><sub>2</sub> (fails if <i>r</i><sub>1</sub> &gt; <i>r</i><sub>2</sub>)',
     'program': [
         [allInstructions['j'], [1, 2, 5]],
         [allInstructions['s'], [1]],
         [allInstructions['s'], [3]],
         [allInstructions['j'], [1, 1, 1]],
         [allInstructions['t'], [3, 1]],
         [allInstructions['z'], [2]],
         [allInstructions['z'], [3]]
    ]},
    {'id': 'multiplication', 'name': 'Multiplication',
     'description': 'Multiplies <i>r</i><sub>1</sub> and <i>r</i><sub>2</sub>',
     'program': [
         [allInstructions['j'], [1, 3, 12]],
         [allInstructions['j'], [2, 3, 11]],
         [allInstructions['t'], [1, 3]],
         [allInstructions['s'], [5]],
         [allInstructions['j'], [2, 5, 11]],
         [allInstructions['z'], [4]],
         [allInstructions['s'], [3]],
         [allInstructions['s'], [4]],
         [allInstructions['j'], [1, 4, 4]],
         [allInstructions['j'], [1, 1, 7]],
         [allInstructions['t'], [3, 1]],
         [allInstructions['z'], [2]],
         [allInstructions['z'], [3]],
         [allInstructions['z'], [4]],
         [allInstructions['z'], [5]]
    ]}
];

var formats = [
    {'id': 'table', 'name': 'Table format', 'function': tableFormat},
    {'id': 'tex', 'name': 'TeX format', 'function': wrappedTexFormat},
    {'id': 'plain', 'name': 'Plain text format',
     'function': wrappedPlainTextFormat}
]

var currentFormat = 'table';

var registerRowSize = 5;

function element(name, attributes, content) {
    var e = $(document.createElement(name));

    if (content) { e.text(content); }
    for (a in attributes) { e.attr(a, attributes[a]); }

    return e;
}

$(document).ready(function() {
    addControls();
    addSamplePrograms();
    addRegisterRow();
    $('#input-program').keyup(handleTextArea);
});

function addControls() {
    var controls = element('span', {'class': 'controls'});
    var collapse = element('span', {'class': 'click'});

    expandCollapseHeader(collapse, 'collapse', true);

    $('h2').prepend(controls.append('[ ').append(collapse).append(' ]'));
}

function addSamplePrograms() {
    var samples = element('dl');

    $.each(samplePrograms, function(i, sample) {
        var title = element('dt', {'class': 'click'}, sample['name']);
        var description = element('dd');

        title.click(loadSample(sample['id']));
        description.html(sample['description']);

        samples.append(title);
        samples.append(description);
    });

    $('#samples').append(samples);
}

function addRegisterRow() {
    var start = $('#registers input').length;
    var rows = $('#registers dl').length;

    var div = element('div', {'id': 'registers-' + rows});
    var row = element('dl');
    var controls = element('div', {'class': 'controls'})
    var add = element('span', {'class': 'click'}, '+');
    var remove = element('span', {'class': 'click'}, '-');

    add.click(addRegisterRow);
    remove.click(removeRegisterRow);

    controls.append('[ ').append(add);
    if (rows > 0) { controls.append(' | ').append(remove); }
    controls.append(' ]');

    for (var i = start; i < (start + registerRowSize); i++) {
        var label = element('dt').
            append(element('i', {}, 'r')).
            append(element('sub', {}, i+1));

        var input = element('input',
                            {'id': 'r-'+(i+1), 'value': 0, 'type': 'text'});

        input.change(showResults);
        row.append(label);
        row.append(element('dd').append(input));
    }

    div.append(controls);
    div.append(row);

    $('#registers').append(div);
}

function handleTextArea() {
    $(this).attr('rows', $(this).val().split('\n').length);
    showResults();
}

function showResults(format) {
    var program = parseURM($('#input-program').val());
    var registers = $.map($('#registers input'), function(register) {
        return parseInt('0' + $(register).val().replace(/\D/g, ''), 10);
    });

    var results = runURM(program, registers, 1, []);

    $('#parsed-program pre').html(addLineBreaks(displayURM(program)));

    changeFormat(currentFormat, [results]);
}

function collapseHeader() { expandCollapseHeader(this, 'collapse'); }
function expandHeader() { expandCollapseHeader(this, 'expand'); }

function expandCollapseHeader(elem, mode, arrowsOnly) {
    var details = {
        'expand': {'arrow': '&#x21e9;', 'click': collapseHeader},
        'collapse': {'arrow': '&#x21e7;', 'click': expandHeader}
    };

    $(elem).html(details[mode]['arrow']);
    $(elem).unbind();
    $(elem).click(details[mode]['click']);

    if (!arrowsOnly) {
        $(elem.parentNode.parentNode.parentNode).children(':not(h2)').toggle();
    }
}

function removeRegisterRow() { $('#registers>div').last().remove(); }

function loadSample(sampleID) {
    var program = ($.grep(samplePrograms, function(sample) {
        return (sample['id'] == sampleID);
    })[0] || samplePrograms[0])['program'];

    return function() {
        $('#input-program').val(displayURM(program));
        $('#input-program').keyup();
    };
}

function addLineBreaks(text) { return text.replace(/\n/g, "<br>"); }

function changeFormat(newFormat, lines) {
    var results = $('#results');
    var format = $.grep(formats, function(format) {
        return (format['id'] == newFormat);
    })[0] || formats[0];

    currentFormat = format['id'];

    results.empty();
    results.append(format['function'].apply(this, lines));
    results.append(showFormats(newFormat, lines));
}

function showFormats(currentFormat, lines) {
    var links = element('ul', {'id': 'formats'});

    $.each(formats, function(i, format) {
        if (format['id'] != currentFormat) {
            var link = element('span', {'class': 'click'}, format['name']);

            link.unbind();
            link.click(function() { changeFormat(format['id'], lines); });
            links.append(element('li').append(link));
        }
    });

    return links;
}

function tableFormat(lines) {
    var filledLines = fillZeroes(lines);
    var table = element('table');
    var headerRow = element('tr');
    var tableBody = element('tbody');

    headerRow.append(element('td', {}, 'Instruction'));

    for (var i = 1; i < filledLines[0].length; i++) {
        headerRow.append(element('td').
                         append(element('i', {}, 'r')).
                         append(element('sub', {}, i)));
    }

    $.each(filledLines, function(i, line) {
        var row = element('tr');

        $.each(line, function(j, c) { row.append(element('td', {}, '' + c)); });

        tableBody.append(row);
    });

    return table.append(element('thead').append(headerRow)).append(tableBody);
}

function wrappedTexFormat(l) { return wrapFormat(l, texFormat); }
function wrappedPlainTextFormat(l) { return wrapFormat(l, plainTextFormat); }

function wrapFormat(lines, func) {
    var elem = element('textarea', {'rows': lines.length + 1});

    elem.val(func(lines));

    return elem;
}
