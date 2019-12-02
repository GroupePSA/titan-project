///////////////////
// Grok debugger //
///////////////////

$( "#grokDebuggerModal" ).on('shown.bs.modal', function(){
    inputLineGrokEditor.resize()
    grokPatternEditor.resize()
});

// Launch the grok debugger process
function launchGrokDebugger() {
    var body = {
        "line": inputLineGrokEditor.getSession().getValue(),
        "grok_pattern": grokPatternEditor.getSession().getValue()
    }

    var customPattern = $('#custom_logstash_patterns_input').val()
    if (customPattern != "" ) {
        body.extra_patterns = customPattern
    }

    $.ajax({
        url: api_url + "/grok_tester",
        type: "POST",
        data: JSON.stringify(body),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            if (data.succeed) {
                if (data.results.length == 0) {
                    $('#grok_output').text("Nothing was received :(")
                } else {
                    var steps = data.results.reverse()
                    var res = ""
                    var alreadySucceed = false
                    var mark_theme = ""
                    var globalPatternSuccess = false

                    for (var i in steps) {
                        var step = steps[i]
                        if (step.result != null) {
                            var val = jsonSyntaxHighlight(step.result) + "<br/>"
                            mark_theme = "mark-success"
                            alreadySucceed = true

                            if (i == 0) {
                                globalPatternSuccess = true
                            }
                        } else {
                            if (alreadySucceed) {
                                mark_theme = "mark-warning"
                                val = "<p class='text-warning'>Doesn't seems to match here, probably not important <br/>as it succeed in the following steps</p>"
                            } else {
                                mark_theme = "mark-danger"
                                val = "<p class='text-danger'>Doesn't seems to match here :(</p>"
                            }
                        }

                        var title = "<p><ins>Step " + (steps.length - i) + "</ins></p>"
                        var pattern = "<p style='margin-bottom: 0px'>\"" + escapeHtml(step.pattern) + "\"</p><br/>"
                        var diff = "Diff : <mark class='" + mark_theme + "'>" + escapeHtml(step.diff) + "</mark><br/><br/>"
                        res += title + pattern + diff + val + "<br/>"
                    }

                    $('#grok_output').html(res)

                    if (globalPatternSuccess && "operations_per_second" in data && data.operations_per_second != undefined) {
                        $('#grok_parsing_performances').html('<i>' + data.operations_per_second + ' events/s </i><i class="fas fa-question-circle" style="font-size: 0.7em" data-toggle="tooltip" title="This value is computed by the backend server, and is NOT REPRESENTATIVE of Logstash Grok performance. However, you can use it to compare or optimize your grok patterns, as the difference will be in the same magnitude on a real Logstash."></i>')
                    } else {
                        $('#grok_parsing_performances').html("")
                    }
                }
            } else {
                toastr.error('There was an error while doing this process', 'Error')
            }
        },
        error: function () {
            jobFailed()
        }
    });
}

// Set a trigger on click on guess
$('#launch_grok_debugger').click(launchGrokDebugger);
