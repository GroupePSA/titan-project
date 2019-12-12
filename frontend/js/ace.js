/////////////////////
// Init ACE editor //
/////////////////////

// We want to incldue externals languages
ace.require("ace/ext/language_tools");
var beautify = ace.require("ace/ext/beautify");

// Find and replace text in editor

function findAndReplaceTextEditor(ed, pattern, value) {
    var logstash_filter = ed.getValue()
    var lines = logstash_filter.split('\n')

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]

        lines[i] = line.replace(pattern, value)

    }

    logstash_filter = lines.join('\n')
    ed.setValue(logstash_filter, -1)
}

// Build the ACE editor to edit configuration
function buildInputDataEditor() {
    var editor = ace.edit("input_data_textarea");
    editor.session.setMode("ace/mode/elixir");

    editor.setOptions({
        fontSize: "12pt",
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        indentedSoftWrap: false,
        useSoftTabs: false,
        showPrintMargin: false,
        enableSnippets: false,
        navigateWithinSoftTabs: false,
        autoScrollEditorIntoView: true,
        keyboardHandler: "ace/keyboard/sublime"
    })

    return editor
}

// Build the ACE editor to enter the sample line for grok
function buildInputLineGrokEditor() {
    var editor = ace.edit("line_sample_input");
    editor.session.setMode("ace/mode/elixir");

    editor.setOptions({
        fontSize: "12pt",
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        indentedSoftWrap: false,
        useSoftTabs: false,
        showPrintMargin: false,
        enableSnippets: false,
        navigateWithinSoftTabs: false,
        autoScrollEditorIntoView: true,
        minLines: 1,
        maxLines: 1,
        keyboardHandler: "ace/keyboard/sublime"
    })

    editor.getSession().on('change', function(e) {
        var text = editor.getSession().getValue()
        var lines = text.split("\n")

        if (lines.length > 0 && text != lines[0]) {
            editor.getSession().setValue(lines[0], -1)
            editor.resize()
        }
    })

    return editor
}

// Build the ACE editor to enter the sample line for grok
function buildGrokPatternEditor() {
    var editor = ace.edit("grok_pattern_input");
    editor.session.setMode("ace/mode/logstash");

    editor.setOptions({
        fontSize: "12pt",
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        indentedSoftWrap: true,
        useSoftTabs: true,
        showPrintMargin: false,
        enableSnippets: false,
        navigateWithinSoftTabs: true,
        autoScrollEditorIntoView: true,
        minLines: 1,
        maxLines: 1,
        keyboardHandler: "ace/keyboard/sublime"
    })

    editor.getSession().on('change', function(e) {
        var text = editor.getSession().getValue()
        var lines = text.split("\n")

        if (lines.length > 0 && text != lines[0]) {
            editor.getSession().setValue(lines[0], -1)
            editor.resize()
        }
    })

    return editor
}

// Build the ACE editor to edit the Logstash configuration
function buildFilterEditor() {
    var editor = ace.edit("logstash_filter_textarea");
    editor.session.setMode("ace/mode/logstash");
    editor.session.setTabSize(2);

    editor.setOptions({
        fontSize: "12pt",
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        indentedSoftWrap: true,
        useSoftTabs: true,
        showPrintMargin: false,
        enableSnippets: false,
        navigateWithinSoftTabs: true,
        autoScrollEditorIntoView: true,
        keyboardHandler: "ace/keyboard/sublime"
    })

    // Editor save and open behavior

    editor.commands.addCommand({
        name: 'save',
        bindKey: { win: "Ctrl-S", "mac": "Cmd-S" },
        exec: function (editor) {
            var data = editor.session.getValue()
            saveToFile(data, "logstash_filter.conf")
        }
    })

    editor.commands.addCommand({
        name: 'open',
        bindKey: { win: "Ctrl-O", "mac": "Cmd-O" },
        exec: function (editor) {
            $('#filter_input_loading').trigger("click")
        }
    })

    editor.commands.addCommand({
        name: 'autoident',
        bindKey: { win: "Ctrl-I", "mac": "Cmd-I" },
        exec: function (editor) {
            beautify.beautify(editor.session)
        }
    })

    return editor
}

// Meta function to read file content
function readSingleFile(e, callback) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        callback(contents)
    };
    reader.readAsText(file);
}

// Read the content of a single file, and put it into the editor
function loadConfEditor(e) {
    readSingleFile(e, (contents) => {
        editor.session.setValue(contents);
    })
}

// We create a callback when user click on the input loading
document.getElementById('filter_input_loading').addEventListener('change', loadConfEditor, false);

// Save a string to file
function saveToFile(data, filename, filetype) {

    if (filetype == undefined) {
        filetype = 'text/plain'
    }

    var blob = new Blob([data], { type: filetype }),
        e = document.createEvent('MouseEvents'),
        a = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

// Create the editors that will be used by others files
var editor = buildFilterEditor()
var inputEditor = buildInputDataEditor()

var inputLineGrokEditor = buildInputLineGrokEditor()
var grokPatternEditor = buildGrokPatternEditor()

// Resize editor to make content feet

function resizeEditorForContent(editor, maxLinesShowed) {
    var doc = editor.getSession().getDocument(); 

    var lineHeight = editor.renderer.lineHeight;

    var docNumber = doc.getLength()
    if (maxLinesShowed != undefined && docNumber > maxLinesShowed) {
        docNumber = maxLinesShowed
    }

    var height = (lineHeight + 2) * docNumber
    resizeEditor(editor, height)
}

// Resize an editor with heigh parameter

function resizeEditor(editor, height) {
    var editorDiv = $('#' + editor.container.id);
    var editorWrapperDiv = $('#' + editor.container.id + "_wrapper");
    editorDiv.css('height', height)
    editorWrapperDiv.css('height', height)
    editor.resize();
}

// Allow editors to be resizable!

window.draggingAceEditor = {};

function makeAceEditorResizable(editor){
    var id_editor = editor.container.id;
    var id_dragbar = '#' + id_editor + '_dragbar';
    var id_wrapper = '#' + id_editor + '_wrapper';
    var wpoffset = 0;
    window.draggingAceEditor[id_editor] = false;

    $(id_dragbar).mousedown(function(e) {
        e.preventDefault();

        window.draggingAceEditor[id_editor] = true;
    
        var _editor = $('#' + id_editor);
        var top_offset = _editor.offset().top - wpoffset;
    
        _editor.css('opacity', 0);

        $(document).mousemove(function(e){
            var actualY = e.pageY - wpoffset;
            var eheight = actualY - top_offset;
            
            $(id_wrapper).css('height', eheight);
            $(id_wrapper).css('border-width', "1px");
            $(id_dragbar).css('opacity', 0.15);
        });
    });
    
    $(document).mouseup(function(e){

        if (window.draggingAceEditor[id_editor])
        {
            var ctx_editor = $('#' + id_editor);
    
            var actualY = e.pageY - wpoffset;
            var top_offset = ctx_editor.offset().top - wpoffset;
            var eheight = actualY - top_offset;
    
            $( document ).unbind('mousemove');

            $(id_wrapper).css('border-width', "0px");
            $(id_dragbar).css('opacity', 1);
            ctx_editor.css('height', eheight).css('opacity', 1);

            editor.resize();

            window.draggingAceEditor[id_editor] = false;

            saveSession()
        }
    });
}

makeAceEditorResizable(editor);
makeAceEditorResizable(inputEditor);

// Add this little trick to force editor to load on startup
window.onload = () => {
    inputEditor.resize();
    editor.resize();
    inputLineGrokEditor.resize();
    grokPatternEditor.resize();
}