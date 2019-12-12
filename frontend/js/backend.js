///////////////////////////
// Backend communication //
///////////////////////////

// Escape a string to html
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// A function to display beautiful json

function jsonSyntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else if (/"(?:(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z))|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:[+-][0-2]\d:[0-5]\d|Z))|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d(?:[+-][0-2]\d:[0-5]\d|Z)))"/.test(match)) {
                cls = 'date';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// We clean useless lines at start of the Logstash stdout

function cleanLogstashStdout(stdout) {
    var stdout_splitted = stdout.split("\n")
    var stdout_cleaned = []
    for (var i = 0; i < stdout_splitted.length; i++) {
        var line = stdout_splitted[i]
        if (!/^Sending Logstash.*logs.*configured.*log4j2\.properties$/.test(line)
            && !/^\[\d+.*WARN.*logstash\.config\.source.*Ignoring.*pipelines.yml.*$/.test(line)
            && !/^\[\d+.*WARN.*logstash\.agent.*stopping pipeline.*$/.test(line)
            && !/^\[\d+.*org\.logstash\.instrument\.metrics\.gauge\.LazyDelegatingGauge.*A gauge metric.*This may result in invalid serialization.*$/.test(line)
            && !/^The stdin plugin is now waiting for input:$/.test(line)) {
            stdout_cleaned.push(line)
        }
    }
    return stdout_cleaned
}

// We clean useless lines at start of the Logstash stderr

function cleanLogstashStderr(stderr) {
    var stderr_splitted = stderr.split("\n")
    var stderr_cleaned = []
    for (var i = 0; i < stderr_splitted.length; i++) {
        var line = stderr_splitted[i]
        if (!/^WARNING: Illegal reflective access by com\.headius\.backport9\.modules\.Modules.*$/.test(line)
            && !/^WARNING: Please consider reporting this to the maintainers of com\.headius\.backport9\.modules\.Modules$/.test(line)
            && !/^WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective access operations$/.test(line)
            && !/^WARNING: All illegal access operations will be denied in a future release$/.test(line)
            && !/^OpenJDK 64-Bit Server VM warning: Using the ParNew young collector with the Serial old collector is deprecated and will likely be removed in a future release$/.test(line)
            && !/^WARNING: An illegal reflective access operation has occurred$/.test(line)
            && !/^Thread\.exclusive is deprecated, use Thread::Mutex$/.test(line)) {
            stderr_cleaned.push(line)
        }
    }
    return stderr_cleaned.join("\n")
}

// We check if logstash met a problems during the process

function logstashParsingProblem() {
    for (var i = 0; i < logstash_output.length; i++) {
        var line = logstash_output[i]
        if (line.startsWith("[ERROR]")) {
            return { isProblem: true, cause: "logstash", filter: "[ERROR]" }
        }
        if (/^\[\d+.*\[ERROR\s*\].*$/.test(line)) {
            return { isProblem: true, cause: "logstash", filter: "[ERROR" }
        }
        if (line.startsWith("{")) {
            var values = JSON.parse(line)
            if ("tags" in values) {
                for (var j in values.tags) {
                    var tag = values.tags[j]
                    if (tag.indexOf("failure") != -1) {
                        return { isProblem: true, cause: "failure", filter: "failure" }
                    }
                }
            }
        }
    }

    return { isProblem: false }
}

// Guess a value type

function guessStringType(str) {

    if (/^[0-9]+$/.test(str)) {
        return "integer"
    }

    if (/^[0-9]+\.[0-9]+$/.test(str)) {
        return "float"
    }

    if (str == "true" || str == "false") {
        return "boolean"
    }

    return "string"
}

// Find a value type

function getValueType(value) {
    if (Number(value) === value) {
        if (value % 1 === 0) {
            return "integer"
        } else {
            return "float"
        }
    }

    if (Array.isArray(value)) {
        return "array"
    }
    if (typeof value == "boolean") {
        return "boolean"
    }

    if (typeof value == "string") {
        if (/^(?:(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z))|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:[+-][0-2]\d:[0-5]\d|Z))|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d(?:[+-][0-2]\d:[0-5]\d|Z)))$/.test(value)) {
            return "date"
        }

        return "string"
    }

    return "object"
}

// Try do find some advices / problem in current parsing

function findParsingOptimizationAdvices(parent, array) {

    var isRootEventLevel = (parent == "")

    if (isRootEventLevel) {
        $("#parsing_advices").empty()
        $("#parsing_advices").append("<h5>Parsing advices:</h5>")
        $("#parsing_advices").append("<ul>")
    }

    var keys = {}
    var subEvents={}

    var fieldsToSkip = []
    var realEventNumber = 0

    var fieldConversionBlacklist = ["port"]

    if (isRootEventLevel) {
        fieldsToSkip = ["@timestamp", "@version", "host", "message"]
    }

    for (var i = 0; i < array.length; i++) {
        var line = array[i]
        if (line.startsWith("{")) {
            realEventNumber += 1
            var obj = JSON.parse(line)
            for (var key in obj) {
                if (!fieldsToSkip.includes(key)) {
                    if (!(key in keys)) {
                        keys[key] = {
                            "types": [],
                            "guessType": [],
                            "occurence": 0,
                            "canBeTrim": false,
                            "min": 1000000,
                            "max": -9999999,
                            "avg": 0,
                            "sum": 0,
                            "values_occurences": {}
                        }
                    }
                    
                    var value = obj[key]
                    var valueType = getValueType(value)

                    if (valueType == "string") {
                        var valueTypeGuessed = guessStringType(value)
                        if (!keys[key]["guessType"].includes(valueTypeGuessed)) {
                            keys[key]["guessType"].push(valueTypeGuessed)
                        }
                        if(valueTypeGuessed == "string" && value.trim() != value) {
                            keys[key]["canBeTrim"] = true
                        }
                    } else if (valueType == "object") {
                        if (!(key in subEvents)) {
                            subEvents[key] = []
                        }
                        subEvents[key].push(JSON.stringify(value))
                    } else if (valueType == "integer" || valueType == "float") {
                        if (value < keys[key]["min"]) {
                            keys[key]["min"] = value
                        }
                        if (value > keys[key]["max"]) {
                            keys[key]["max"] = value
                        }
                        keys[key]["sum"] = keys[key]["sum"] + value
                    }

                    if (valueType != "object") {
                        if (!(value in keys[key]["values_occurences"])) {
                            keys[key]["values_occurences"][value] = 0
                        }
                        keys[key]["values_occurences"][value] = keys[key]["values_occurences"][value]+1
                    }

                    if (!keys[key]["types"].includes(valueType)) {
                        keys[key]["types"].push(valueType)
                    }

                    keys[key]["occurence"] += 1
                }
            }
        }
    }

    for(key in subEvents) {
        var fullKey = (isRootEventLevel ? "" : parent + ".") + key
        findParsingOptimizationAdvices(fullKey, subEvents[key])
    }

    var badFieldNames = []
    for (var key2 in keys) {
        if (!/^[a-zA-Z0-9_]+$/.test(key2)) {
            badFieldNames.push(key2)
        }
        if (keys[key2]["sum"] != 0) {
            keys[key2]["avg"] = keys[key2]["sum"] / keys[key2]["occurence"]
        }
    }

    var advicesShouldBeShown = false

    for (key in keys) {
        var fieldname = (isRootEventLevel ? "" : parent + ".") + key
        var str = ""
        if (keys[key]["types"].length > 1) {
            advicesShouldBeShown = true
            str = '<li>Field <a href="#output" onclick="applyFilter(\'' + key + '\')">' + fieldname + "</a>"
            str += " got <b>multiple types</b> : " + keys[key]["types"].join(", ") + "</li>"
            $("#parsing_advices").append(str);
        } else if (keys[key]["types"].length == 1 && keys[key]["guessType"].length == 1 && keys[key]["types"][0] != keys[key]["guessType"][0] && !fieldConversionBlacklist.includes(key)) {
            advicesShouldBeShown = true
            str = '<li>Field <a href="#output" onclick="applyFilter(\'' + key + '\')">' + fieldname + "</a>"
            str += " of type " + keys[key]["types"][0] + " could probably be <b>convert</b> into " + keys[key]["guessType"][0] + "</li>"
            $("#parsing_advices").append(str);
        } else if (keys[key]["types"].length == 1 && keys[key]["types"][0] == "array") {
            advicesShouldBeShown = true
            str = '<li>Field <a href="#output" onclick="applyFilter(\'' + key + '\')">' + fieldname + "</a>"
            str += " is an <b>array</b>. Be aware that not many visualizations allow use of that kind of field in Kibana.</li>"
            $("#parsing_advices").append(str);
        } else if (keys[key]["types"].length == 1 && keys[key]["types"][0] == "string" && keys[key]["canBeTrim"]) {
            advicesShouldBeShown = true
            str = '<li>Value of field <a href="#output" onclick="applyFilter(\'' + key + '\')">' + fieldname + "</a>"
            str += " could probably be <b>trimed</b>, as it sometime start or end with blanck characters</li>"
            $("#parsing_advices").append(str);
        }
    }

    for (key in badFieldNames) {
        fieldname = (isRootEventLevel ? "" : parent + ".") + badFieldNames[key]
        advicesShouldBeShown = true
        str = '<li>Fieldname <a href="#output" onclick="applyFilter(\'' + badFieldNames[key] + '\')">' + fieldname + "</a>"
        str += " should contains only characters in range A-Z, a-z, 0-9, or _</li>"
        $("#parsing_advices").append(str);
    }

    if (isRootEventLevel) {
        $("#parsing_advices").append("</ul>")
        
        $("#data_explorer_container").removeClass("d-none")
        $("#data_explorer").empty()

        // To to cleaner : consider those fields as exported
        fields_characteristics = keys
        totalRealEventNumber = realEventNumber
        
        for(key in keys) {
            str = '<div class="col-lg-3">'
            str += "<h5 class='text-center text-info' style='margin-bottom: 2em; margin-top: 2em'>" + key + "</h5>"
            var color = "found-some"
            if (keys[key]["occurence"] == realEventNumber) {
                color = "found-ok"
            }
            str += "<p>In <b class='" + color + "'>" + parseFloat(keys[key]["occurence"]/realEventNumber*100).toFixed(2) + "&#37;</b> of events</p>"

            str += "<p>Type : <b>" + keys[key]["types"].join(", ") + "</b></p>"

            if (keys[key]["types"].length == 1 && (keys[key]["types"][0] == "integer" || keys[key]["types"][0] == "float")) {
                str += "<p>Characteristics:</p><ul>"
                str += "<p><b>min</b> : " + keys[key]["min"] + "</p>"
                str += "<p><b>max</b> : " + keys[key]["max"] + "</p>"
                str += "<p><b>avg</b> : " + keys[key]["avg"] + "</p>"
            }

            str += "</br><u><p>Top 5 values:</p></u><ul class='list-group'>"
            var values = createTopXValues(keys[key]["values_occurences"], 5)
            for (i in values) {
                if (i > 5) {
                    break
                }
                var valueToDisplay = String(values[i][0]).substring(0, 100)
                if (String(values[i][0]).length != valueToDisplay.length) {
                    valueToDisplay = valueToDisplay + "..."
                }
                var other_classes = ""
                if (values.length == 1) {
                    other_classes = " background-emphasis"
                }
                str += "<li class='list-group-item" + other_classes + "'>" + valueToDisplay + " (" + parseFloat(values[i][1]/realEventNumber*100).toFixed(2) + "%)</li>"
            } 
            str +="</ul>"

            str += "</div>"

            $("#data_explorer").append(str)
        }
    }

    if (advicesShouldBeShown) {
        $("#parsing_advices").removeClass("d-none")
    }
}

function createTopXValues(dict, x) {
var items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });
  
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  
  return items.slice(0, x)
}

// Escape string characters to build a Regex

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Set background color to pattern in string

function hightlightMatch(str, pattern, value) {
    return str.replace(new RegExp(pattern, 'g'), "<span class='background-highlight'>" + value + "</span>");
}

// Sort a dictionary by key.

function sortDictionary(dict) {

    var sorted = [];
    for (var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for (var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}

// Display logstash log with formatting

function refreshLogstashLogDisplay() {
    var filter_value = $('#filter_display').val()
    var filter_regex_enabled = $('#filter_regex_enabled').is(':checked')
    var filter_reverse_match_enabled = $('#filter_reverse_match_enabled').is(':checked')
    var filter_enabled = (filter_value != "")

    if (filter_regex_enabled && filter_value != "") {
        var filter_regex = new RegExp(filter_value)
    } else {
        filter_regex = new RegExp(escapeRegExp(filter_value))
    }

    var number_lines_display = $("#number_lines_display").val()
    if (number_lines_display == "unlimited") {
        number_lines_display = 100000;
    } else {
        number_lines_display = parseInt(number_lines_display, 10)
    }

    $("#number_events_displayed_container").removeClass("d-none")

    var logstash_output_stderr_arr = logstash_output_stderr.split('\n')
    var lines = logstash_output_stderr_arr.concat(logstash_output)

    var stderr_errors_lines = logstash_output_stderr_arr.length
    var matchNumber = 0
    var realLinesNumber = 0
    var res = ""

    for (var i = 0; i < lines.length; i++) {

        var line = lines[i]

        if (line != "") {
            realLinesNumber += 1;
        
            if (!filter_enabled || (!filter_reverse_match_enabled && line.match(filter_regex)) || (filter_reverse_match_enabled && !line.match(filter_regex))) {

                // We need that to know exactly how many lines match the pattern, if any
                if (matchNumber < number_lines_display) {
                    if (line.startsWith("[")) {
                        line = line.replace(/\\r\\n/g, '\n')
                        line = line.replace(/\\n/g, '\n')
                        line = line.replace(/\\t/g, '  ')
                        line = escapeHtml(line)
                    } else if (line.startsWith("{") && line.endsWith("}")) {
                        var jsonDic = JSON.parse(line)
                        jsonDic = sortDictionary(jsonDic)
                        var obj = JSON.stringify(jsonDic, null, 2);
                        line = jsonSyntaxHighlight(obj)
                    }

                    if (i < stderr_errors_lines) {
                        line = "<span class='text-danger'>" + line + "</span>"
                    }
        
                    if (filter_value != "" && filter_value.length > 1 && !filter_regex_enabled) {
                        line = hightlightMatch(line, filter_regex, filter_value)
                    }
                    
                    res += line + "\n"
                }

                matchNumber += 1
                
            }

        }

    }

    if (res.length == 0) {
        if (logstash_output.length == 0) {
            res = "No data received :("
        } else {
            res = "Nothing match your filter :("
        }
    }



    // We display the number of events we got / we found

    if (filter_enabled) {

        if (matchNumber > realLinesNumber) {
            matchNumber = realLinesNumber
        }

        var color = "found-some"
        if (matchNumber == realLinesNumber) {
            color = "found-ok"
        } else if (matchNumber == 0) {
            color = "found-none"
        }

        $('#number_events_displayed').html("<span class='" + color + "'>" + matchNumber + " / " + realLinesNumber + "</span> events <b>matched</b>")
    } else {
        $('#number_events_displayed').html("<b>" + realLinesNumber + "</b> total events")

    }

    $('#output').html(res);
}

// Manage if backend fail to treat user input

function jobFailed() {
    $("#start_process").removeClass('disabled');
    $('#failModal').modal('show');
    $('#failModalReason').html("Unable to obtain a response from the backend server.<br/>You cannot do anything to solve it, please contact the maintainer of this project.");

    $("#start_process").removeClass('disabled');
    $('#output').text('No data was receive from backend server :(');
}

$('#clear_form').click(function () {
    inputEditor.getSession().setValue("", -1)
    editor.getSession().setValue("", -1);
    $('#output').text("The Logstash output will be shown here !");
    $('#fields_attributes_number').val(0);
    $('#filter_regex_enabled').prop('checked', false)
    $('#filter_display').val("")
    $('#backend_response_time').text("0")
    applyFieldsAttributes()
    disableMultilineCodec()
    fileUploadDisabled()
    saveSession();
    toastr.success("Successfully cleaned your workspace", "Success")
});

// Remove the previous alert status from latest run container

function removeLatestRunStatus() {
    $("#latest_run_container").removeClass(function (index, className) {
        return (className.match(/(^|\s)alert-\S+/g) || []).join(' ');
    });
    $("#latest_run_container").removeClass("d-none")
}

// Apply a custom filter

function applyFilter(filter, reverse) {
    $('#filter_regex_enabled').prop('checked', false)
    $('#filter_reverse_match_enabled').prop('checked', reverse)
    $('#filter_display').val(filter)

    refreshLogstashLogDisplay()
}

// Manage result of Logstash process

function manageResultLogstashProcess(code, type, message) {
    var notif = null;

    if (code == "error") {
        notif = toastr.error(message, type)

        removeLatestRunStatus()
        $("#latest_run_container").addClass("alert-danger")
    } else if (code == "warning") {
        notif = toastr.warning(message, type)

        removeLatestRunStatus()
        $("#latest_run_container").addClass("alert-warning")
    } else if (code == "success") {
        notif = toastr.success(message, type)

        removeLatestRunStatus()
        $("#latest_run_container").addClass("alert-success")
    }

    $("#latest_run_status").html(type)
    $("#latest_run_message").html(message)

    return notif
}

// The main process, that will send data to backend

$('#start_process').click(function () {

    if($('#start_process').hasClass("disabled")) {
        toastr.info("Current process isn't yet finished", 'Please wait')
        return
    }

    $('#backend_response_time').text("0")
    saveSession()

    if (userInputValid()) {

        var body = {
            logstash_filter: editor.getSession().getValue(),
            input_extra_fields: getFieldsAttributesValues(),
            logstash_version: $('#logstash_version :selected').text()
        };

        if (remote_file_hash == undefined) {
            body.input_data = inputEditor.getSession().getValue()
        } else {
            body.filehash = remote_file_hash
        }

        if ($('#enable_custom_codec').is(':checked')) {
            body.custom_codec = $('#custom_codec_field').val();
        }

        if ($('#custom_logstash_patterns_input').val() != "") {
            body.custom_logstash_patterns = $('#custom_logstash_patterns_input').val();
        }

        $('#output').html('<div style="padding-top: 1em; padding-bottom: 1em"><div class="spinner-border" style="display: block; margin: auto;" role="status><span class="sr-only"></span></div></div>');
        $("#start_process").addClass('disabled');
        $("#latest_run_container").addClass("d-none")
        $("#parsing_advices").addClass("d-none")
        $("#download_output").addClass('disabled');

        $.ajax({
            url: api_url + "/logstash/start",
            type: "POST",
            data: JSON.stringify(body),
            contentType: "application/json",
            dataType: "json",
            timeout: 60000,
            success: function (data) {
                logstash_output = cleanLogstashStdout(data.job_result.stdout)
                logstash_output_stderr = cleanLogstashStderr(data.job_result.stderr)

                if(enableParsingAdvices) {
                    findParsingOptimizationAdvices("", logstash_output)
                }

                var parsingResult = logstashParsingProblem()

                var notif;

                if (data.job_result.status == -1) {
                    manageResultLogstashProcess('error', 'Error', 'Unable to execute the process on remote server.')
                } else if (data.job_result.status != 0 || parsingResult.isProblem) {
                    if (data.job_result.status != 0 || parsingResult.cause == "logstash") {
                        notif = manageResultLogstashProcess('error', 'Error', 'There was a problem in <a class="alert-link" href="#output" onclick="applyFilter(\'' + parsingResult.filter + '\')">your configuration</a>.')
                        redirectToastrClick(notif, "logstash_filter_textarea")
                    } else {
                        notif = manageResultLogstashProcess('warning', 'Parsing problems', 'Logstash <a class="alert-link" href="#output" onclick="applyFilter(\'' + parsingResult.filter + '\')">failed to parse</a> some of your events')
                        redirectToastrClick(notif, "logstash_filter_textarea")
                    }
                } else {
                    notif = manageResultLogstashProcess('success', 'Success', 'Configuration parsing is done !')
                    redirectToastrClick(notif, "output")
                }

                if (!data.config_ok) {
                    notif = manageResultLogstashProcess('error', 'Informations missings', 'All fields need to be fill !')
                    redirectToastrClick(notif, "input_extra_attributes")
                }

                var response_time_formatted = (data.job_result.response_time / 1000).toFixed(1)

                refreshLogstashLogDisplay()
                $("#backend_response_time").text(response_time_formatted)
                $("#start_process").removeClass('disabled');
                $("#download_output").removeClass('disabled');
            },
            error: function () {
                jobFailed()
            }
        });

    }

});


// Escape a CSV character

function escapeCSV (term) {
   return term.toString().replace(/"/g, '""').replace(/\n/g, ' ')
}

// build csv from map (key=column_names)

function buildCSV(column_values) {
    var res = ""

    var keys = Object.keys(column_values)
    for (var i = 0 ; i < keys.length ; i++) {
        res = res + '"' + escapeCSV(keys[i]) + '"'
        if (i != keys.length - 1) {
            res = res + ","
        } else {
            res = res + "\n"
        }
    }

    if (keys.length != 0) {
        for(var j = 0 ; j < column_values[keys[0]].length ; j++) {
            for(var k = 0 ; k < keys.length ; k++) {
                var key = keys[k]
                res = res + '"' + escapeCSV(column_values[key][j]) + '"'
                if (k != keys.length - 1) {
                    res = res + ","
                } else {
                    res = res + "\n"
                }
            }
        }
        
    }

    return res
}

// Extract JSON content for output

function getLogstashOutputJson() {
    var res = ""
    for (var i = 0; i < logstash_output.length; i++) {
        var line = logstash_output[i]
        if (line.startsWith("{") && line.endsWith("}")) {
            if (res != "") {
                res = res + "\n"
            }
            res = res + line
        }
    }
    return res
}

// Recursive function to get CSV values for an JS object

function getLogstashOutputCSVStep(currentEvent, level, columns_values, currentRow) {
    Object.keys(currentEvent).forEach(function (key) {
        var final_key = (level != "" ? level + "." + key : key)

        if (getValueType(currentEvent[key]) == "object") {
            getLogstashOutputCSVStep(currentEvent[key], final_key, columns_values, currentRow)
        } else {
            if (columns_values[final_key] == undefined) {
                columns_values[final_key] = []
                for (var i = 0 ; i < currentRow ; i++) {
                    columns_values[final_key][i] = ""
                }
            }
            columns_values[final_key][currentRow] = currentEvent[key]
        }
     });
}

// Extract CSV content for output

function getLogstashOutputCSV() {
    var columns_values = {}
    var rowCounter = 0;

    // We parse the JSON values
    for (var i = 0; i < logstash_output.length; i++) {
        var line = logstash_output[i]
        if (line.startsWith("{") && line.endsWith("}")) {
            var values_event = JSON.parse(line)
            getLogstashOutputCSVStep(values_event, "", columns_values, rowCounter)
            rowCounter += 1;
        }
    }

    // We complete columns that may not have the same end as others
    for (var key in columns_values) {
        if (columns_values[key].length != rowCounter) {
            for(var j = columns_values[key].length; j < rowCounter ; j++) {
                columns_values[key][j] = ""
            }
        }
    }

    // We set empty variable to an empty string
    for (var key2 in columns_values) {
        for(var k = 0; k < rowCounter ; k++) {
            if (columns_values[key2][k] == undefined) {
                columns_values[key2][k] = ""
            }
        }
    }

    return buildCSV(columns_values)
}

// Function to save the Logstash output to a file
// Support currently JSON & CSV

function saveOutputToFile(outputType) {
    var filename = "logstash-output." + outputType
    var fileMime = (outputType == "json" ? "application/json" : "text/csv")

    try {
        var res = (outputType == "json" ? getLogstashOutputJson() : getLogstashOutputCSV())
        saveToFile(res, filename, fileMime)
    } catch (error) {
        toastr.error("Failed to export your data as " + outputType.toUpperCase(), "Error")
    }
    
}
