var samplePrograms = [
    {'id': 'addition', 'name': 'Addition', 'program': [
        [allInstructions['j'], [2, 3, 5]],
        [allInstructions['s'], [1]],
        [allInstructions['s'], [3]],
        [allInstructions['j'], [1, 1, 1]],
        [allInstructions['z'], [3]]
    ]}
];

var formats = [
    {'id': 'table', 'name': 'table format', 'function': tableFormat},
    {'id': 'tex', 'name': 'TeX format', 'function': wrappedTexFormat},
    {'id': 'plain', 'name': 'plain text format',
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

// TODO
// onload:
//  - add list of sample programs
//  - insert onchange function for program -> parses, displays in textarea,
//    and evaluates program
$(document).ready(function() {
    addRegisterRow();
    addControls();
});

function addControls() {
    var controls = element('span', {'class': 'controls'});
    var collapse = element('span', {'class': 'click'});

    expandCollapseHeader(collapse, 'collapse', true);

    $('h2').append(controls.append('[ ').append(collapse).append(' ]'));
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

// TODO
function showResults(format) {
    var program = parseURM($('#program textarea').val());
    var registers = $.map($('#registers input'), function(register) {
        return parseInt('0' + $(register).val().replace(/\D/g, ''), 10);
    });

    var results = runURM(program, registers, 1, []);

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

function wrapFormat(lines, func) {
    return element('textarea', {'rows': lines.length + 1}, func(lines));
}

function wrappedTexFormat(l) { return wrapFormat(l, texFormat); }
function wrappedPlainTextFormat(l) { return wrapFormat(l, plainTextFormat); }
