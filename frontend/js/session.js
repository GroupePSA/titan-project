////////////////////////
// Session management //
////////////////////////

// Check if the file still is on the server
function checkRemoteFile() {
    remoteLogExists(remote_file_hash, (exists) => {
        if (!exists) {
            var notif = toastr.warning('Your file is no more on the server, you need to upload it again', 'File uploaded')
            fileUploadDisabledClean()
            redirectToastrClick(notif, "input_data_title")
        }
    })
}

// Save current user session
function saveSession() {
    console.debug("Saving session into cookie")
    var session = {
        minimalist: ($('#css_theme_minimalist').attr('href').indexOf('nominimalist.css') != -1 ? false : true),
        theme: ($('#css_theme_bootstrap').attr('href').indexOf('flatly') != -1 ? "white" : "black"),
        fullscreen: ($('#main_container').hasClass("container") ? false : true),
        text_wrapping: ($('#css_theme_text_wrapping').attr('href').indexOf('no-text-wrapping.css') != -1 ? false : true),
        enable_parsing_advices: enableParsingAdvices,
        logstash_version: $('#logstash_version :selected').text(),
        config: {
            input_data: inputEditor.getSession().getValue(),
            logstash_filter: editor.getSession().getValue(),
            input_fields: getFieldsAttributesValues(),
            custom_logstash_patterns: $('#custom_logstash_patterns_input').val(),
            custom_codec: ($('#enable_custom_codec').is(':checked') ? $('#custom_codec_field').val() : ""),
            remote_file_hash: remote_file_hash,
            filter_regex_enabled: $('#filter_regex_enabled').is(':checked'),
            filter_reverse_match_enabled: $('#filter_reverse_match_enabled').is(':checked'),
            filter_display: $('#filter_display').val(),
            number_lines_display: $("#number_lines_display").val()
        }
    }
    store.set('session', session);
    if (JSON.stringify(store.get('session')) != JSON.stringify(session)) {
        toastr.warning('There was a problem while saving your work', 'Save problem')
    }
}

// Load a config for user
function loadConfig(session) {
    console.debug("Loading user config")

    inputEditor.getSession().setValue(session.input_data, -1)
    $('#custom_logstash_patterns_input').val(session.custom_logstash_patterns)
    $('#filter_regex_enabled').prop('checked', session.filter_regex_enabled)
    $('#filter_reverse_match_enabled').prop('checked', session.filter_reverse_match_enabled)
    $('#filter_display').val(session.filter_display)
    $("#number_lines_display option[data-value='" + session.number_lines_display + "']").attr("selected", "selected");
    editor.getSession().setValue(session.logstash_filter, -1)
    applyFieldsAttributes(session.input_fields)
    if (session.custom_codec != "") {
        enableMultilineCodec(session.custom_codec)
    } else {
        disableMultilineCodec()
    }
    if (session.remote_file_hash != undefined) {
        fileUploadEnabled(session.remote_file_hash)
        checkRemoteFile()
    } else {
        fileUploadDisabled()
    }
}

// Get current config for user
function getConfig() {
    var session = store.get('session');
    return session.config
}

// Load session for user
function loadSession(session) {
    var sessionFound = true

    if (session == undefined) {
        session = store.get('session');
    }
    if (session != undefined) {
        console.debug("Loading user session")
        session.theme == "white" ? enableWhiteTheme() : enableBlackTheme()
        if (session.minimalist) {
            enableMinimalistMode()
        } else {
            disableMinimalistMode()
        }
        if (session.fullscreen) {
            enableFullscreenMode()
        } else {
            disableFullscreenMode()
        }
        if(session.text_wrapping) {
            enableTextWrappingMode()
        } else {
            disableTextWrappingMode()
        }
        if(session.enable_parsing_advices) {
            enableParsingAdvicesMode()
        } else {
            disableParsingAdvicesMode()
        }

        $("#logstash_version option").filter(function() {
            return $(this).text().trim() == session.logstash_version;
        }).prop('selected', true);

        if ("config" in session) {
            loadConfig(session.config)
        } else {  // Compatibility reason
            loadConfig(session)
        }
    } else {
        console.debug("No cookie for session found")
        sessionFound = false
    }

    // We only want to display what is up if user is already a titan-project user
    if (sessionFound && enable_news) {
        showWhatsUpIfNeeded()
    } else {
        storeLatestVersionSeen()
    }
}

// User specific

// Read the content of a single file, and put it into the editor
function loadUserConfig(e) {
    readSingleFile(e, (configString) => {
        try {
            config = JSON.parse(configString)
            loadConfig(config)
            toastr.success('Successfully loaded your saved config', 'Success')
        } catch (e) {
            toastr.error('Your config backup should be a JSON file, is that the right file ?', 'Error')
        }
    })
}

// We create a callback when user click on the input loading
document.getElementById('config_input_loading').addEventListener('change', loadUserConfig, false);

// Function to save current user session to a file

function saveConfigToFile() {
    saveSession()
    var configString = JSON.stringify(getConfig())
    saveToFile(configString, "titan-project-config.json", "application/json")
}

// Function to save current user session to a usable human format

function exportConfigToHuman(format) {
    saveSession()
    var config = getConfig()
    summary = buildHumanSummary(config)

    if(format == "markdown") {
        saveToFile(summary, "titan-project-description.md", "text/markdown")
    } else { // Html
        converter = new showdown.Converter()
        converter.setFlavor('github');
        html = converter.makeHtml(summary);

        var newWin = open('url','Logstash configuration summary');
        newWin.document.write(html);
    }

}

// Share current user configuration

function shareConf() {
    saveSession()
    storeConfigBackend(getConfig(), (result) => {
        if (result.succeed) {
            var url = window.location.protocol + "//" + window.location.host + "?conf=" + result.hash
            $('#shareLinkModal').modal('show');
            $('#share-link-input').val(url);
        } else {
            toastr.error("Unable to share your session :(", "Error")
        }
    })
}

// Store the config on backend

function storeConfigBackend(config, callback) {
    var configString = JSON.stringify(config)

    var md = forge.md.sha512.create();
    md.update(configString);
    var hash = md.digest().toHex()

    var body = {
        hash: hash,
        config: configString
    }
    $.ajax({
        url: api_url + "/config/store",
        type: "POST",
        data: JSON.stringify(body),
        contentType: "application/json",
        dataType: "json",
        success: function (result) {
            return callback(result)
        },
        error: function () {
            jobFailed()
        }
    });
}

// Load the user config if it is being shared

function loadShareConfigIfNeeded() {
    var search = window.location.search
    if (search.length != 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const confHash = urlParams.get('conf');
        if (confHash != undefined) {
            getConfigBackend(confHash, (result) => {
                if (result.succeed) {
                    config = JSON.parse(result.config.value)
                    loadConfig(config)
                    toastr.success('Successfully loaded the shared configuration', 'Success')
                } else {
                    toastr.error("Unable to load the shared session. Is it still valid ?", "Error")
                }
                history.replaceState({}, document.title, "/");
            })
        }
    }
}

// Get the config stored on backend

function getConfigBackend(hash, callback) {
    var body = {
        hash: hash
    }
    $.ajax({
        url: api_url + "/config/get",
        type: "POST",
        data: JSON.stringify(body),
        contentType: "application/json",
        dataType: "json",
        success: function (result) {
            return callback(result)
        },
        error: function () {
            jobFailed()
        }
    });
}

// Build a human summary for current user configuration

function buildHumanSummary(config) {
    var summary = "# Logstash configuration summary\n"

    summary += "\n## Input\n"

    summary += "\n### Data sample\n"
    if(config.input_data.trim().length == 0) {
        summary += "\n> No data provided\n"
    } else {
        summary += "\n```\n"
        summary += config.input_data.split('\n').slice(0, 10).join("\n")
        summary += "\n```\n"
    }
    if(config.custom_codec.trim().length != 0) {
        summary += "\n### Codec\n"
        summary += "\n```\n"
        summary += config.custom_codec
        summary += "\n```\n"
    }
    if(config.input_fields.length != 0) {
        summary += "\n### Input fields\n"
        summary += "\n| Attribute | Value |\n"
        summary += "|-----------|-------|\n"
        for(var i = 0 ; i < config.input_fields.length ; i++) {
            element = config.input_fields[i]
            summary += "|" + escapeHtml(element['attribute']) + "|" + escapeHtml(element['value']) + "|\n"
        }
    }

    summary += "\n## Filter\n"

    if(config.logstash_filter.trim().length == 0) {
        summary += "\n> No data provided\n"
    } else {
        summary += "\n```ruby\n"
        summary += config.logstash_filter
        summary += "\n```\n"
    }

    summary += "\n## Output\n"

    var output_launched = false
    var summary_append = ""

    if(typeof fields_characteristics !== 'undefined' && fields_characteristics.length != 0) {
        output_launched = true
        summary_append += "\n### Output characteristics\n"
        summary_append += "\n| Field | Type | In % of events | Sample |\n"
        summary_append += "|-------|------|----------------|--------|\n"
        for(var field in fields_characteristics) {
            field_characteristic = fields_characteristics[field]
            field_presence = "?"
            if(typeof totalRealEventNumber !== 'undefined') {
                field_presence = parseFloat(field_characteristic["occurence"]/totalRealEventNumber*100).toFixed(2)
            }
            mostPresentValues = createTopXValues(field_characteristic["values_occurences"], 1)
            value = "undefined"
            if (mostPresentValues[0] != undefined) {
                value = String(mostPresentValues[0][0]).substring(0, 100)
            }
            summary_append += "|" + escapeHtml(field) + "|" + escapeHtml(field_characteristic["types"].join(", "))  + "|" + escapeHtml(field_presence)  + "|" + escapeHtml(value) + "|\n"
        }
    }

    logstash_output_json = getLogstashOutputJson()
    if (logstash_output_json.trim() != "") {
        output_launched = true
        logstash_output_json = logstash_output_json.split('\n').slice(0, 5)
        summary_append += "\n### First 5 events parsed\n"
        summary_append += "\n```json\n"
        for(var i in logstash_output_json) {
            event = logstash_output_json[i]
            eventBeautiful = JSON.stringify(JSON.parse(event), null, 4);
            summary_append += eventBeautiful + "\n"
        }
        summary_append += "\n```\n"
    }

    if (!output_launched) {
        summary += "\n> No launch was done, can't provide output details\n"
    } else {
        summary += "\n**Logstash version**: " + $('#logstash_version :selected').text() + "\n"
    }

    summary += summary_append

    return summary
}

// A Trigger to copy the share link text when user click on the button

$(document).ready(function () {
    $('#share-link-button').bind('click', function () {
        var input = document.getElementById('share-link-input');
        input.select()
        try {
            var success = document.execCommand('copy');
            if (success) {
                toastr.success('Your url is copied into your clipboard', 'Success')
            } else {
                toastr.error('Failed to copy the URL. Use CTRL + C instead', 'Failure', { timeOut: 10000 })
            }
        } catch (err) {
            toastr.error('Failed to copy the URL. Use CTRL + C instead', 'Failure', { timeOut: 10000 })
        }
    });

});
