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

// onload:
//  - add list of sample programs
//  - insert onchange function for program -> parses, displays in textarea,
//    and evaluates program
// evaluate:
//  - shows output in default format
//  - displays alternative formats
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

    var row = element('div', {'id': 'registers-' + rows}).append(element('dl'));
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

        input.click(showResults);
        row.append(label);
        row.append(element('dd').append(input));
    }

    row.append(controls);
    $('#registers').append(row);
}

// TODO
function showResults() {
    var program = parseURM($('#program textarea').val());
    var registers = $.map($('#registers input'), function(register) {
        return parseInt('0' + $(register).val().replace(/\D/g, ''), 10);
    });

    var results = runURM(program, registers, 1, []);

    changeFormat(currentFormat, results);
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
    showFormats(newFormat);
}

// TODO
function showFormats(currentFormat) {
    var links = [];

    $.each(formats, function(format) {
        if (format['id'] != 'currentFormat') {
            var link = element('span', {'class': 'click'}, format['name']);

            link.unbind();
            link.click(function() { changeFormat(format['id']); });
            links.push(link);
        }
    });
}

// TODO
function tableFormat(lines) {
}

function wrappedTexFormat(lines) {
    return element('textarea', {}, texFormat(lines));
}

function wrappedPlainTextFormat(lines) {
    return element('textarea', {}, plainTextFormat(lines));
}
