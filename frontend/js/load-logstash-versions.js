////////////////////////////
// Load Logstash versions //
////////////////////////////

// Launch the grok debugger process
function loadLogstashVersions(callback) {
    $.ajax({
        url: api_url + "/logstash/versions",
        type: "GET",
        contentType: "application/json",
        success: function (data) {
            if (data.succeed) {
               
                if(data.versions.length == 0) {
                    toastr.error('No Logstash versions were detected.</br>That`s a big problem.</br>We\'re unable to work.', 'Logstash(s) not found')
                } else {
                    var opt = ""
                    for(var i in data.versions) {
                        version = data.versions[i]
                        opt = opt + '<option data-value="' + version + '" selected="selected">' + version + '</option>'
                    }
                    $('#logstash_version').html(opt)
                }

            } else {
                toastr.error('There was an error while getting Logstash versions', 'Error')
            }
            callback()
        },
        error: function () {
            jobFailed()
            callback()
        }
    });
}