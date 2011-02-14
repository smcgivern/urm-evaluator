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
    // TODO: tableFormat
    {'id': 'default', 'name': 'table format', 'function': 'tableFormat'},
    {'id': 'tex', 'name': 'TeX format', 'function': texFormat},
    {'id': 'plain', 'name': 'plain text format', 'function': plainTextFormat}
]

var registerRowSize = 5;

function element(name, attributes, content) {
    var e = $(document.createElement(name));

    if (content) { e.text(content); }
    for (a in attributes) { e.attr(a, attributes[a]); }

    return e;
}

// http://answers.oreilly.com/topic/2353-5-things-you-might-not-know-about-jquery/

// onload:
//  - add collapse elements after all h2s - DONE!
//  - add list of sample programs
//  - add first row of registers and button to add further registers - DONE!
//  - insert onchange function for registers -> evaluates program - DONE!
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

function removeRegisterRow() { $('#registers>div').last().remove(); }

function showResults() {
    var element = $('#results');

    element.empty();
    element.append('<h3>Evaluation results</h3>');
    elements

    showFormats(format);
}

function showFormats(currentFormat) {
    var links = [];

    $.each(formats, function(format) {
        if (format['id'] != 'currentFormat') {
            var link = $('<span>' + format['name'] + '</span>');

            link.unbind();
            link.click(function() {
                changeFormat(format['id']);
            });

            links.push(link);
        }
    });
}

function changeFormat(newFormat, lines) {
    $.grep(formats, function(format) {
        return (format['id'] == newFormat);
    })[0].apply(this, lines);

    showFormats(newFormat);
}

function foo(){
    var element = $('<ol></ol>');
    element.addClass('steps');

    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var item = (i === 0 ? $('<p></p>') : $('<li></li>'));

        item.addClass(result.id);
        item.attr('title', $('#' + result.id).text());

        item.unbind();
        item.click(function() {
            $('#' + $(this).attr('class')).effect('highlight', {}, 3000);
        });

        if ($.isArray(result)) {
            attachResultsSublist(item, result);
        } else {
            if (result.next[0] === 0) {
                item.append('Check failed: ' + item.attr('title') + '.');
            } else if (result.next[1] === 0) {
                item.append(e(i, result) + p(result.next[0]));
            } else {
                item.append(e(i, result) +
                            legendreSymbol(result.next[0],
                                           result.next[1]));
            }
        }

        (i === 0 ? parent.append(item) : element.append(item));
    }

    parent.append(element);
}
