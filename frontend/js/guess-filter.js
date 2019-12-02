//////////////////
// Guess filter //
//////////////////

// Launch the guess process
function tryToGuessFilter() {
    var body = {}
    if (remote_file_hash == undefined) {
        body.input_data = inputEditor.getSession().getValue()
    } else {
        body.filehash = remote_file_hash
    }

    $.ajax({
        url: api_url + "/guess_config",
        type: "POST",
        data: JSON.stringify(body),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            if(data.succeed) {
                editor.getSession().setValue(data.logstash_filter, -1);

                if (data.custom_codec.length != 0) {
                    enableMultilineCodec(data.custom_codec)
                }

                var notif =  toastr.success('Guess of a Logstash configuration is done !', 'Success')
                redirectToastrClick(notif, "logstash_filter_textarea")
            } else {
                toastr.error('Unable to guess a Logstash configuration for this log file', 'Error')
            }
            
        },
        error: function () {
            jobFailed()
        }
    });
}

// Set a trigger on click on guess
$('#guess_filter').click(tryToGuessFilter);
