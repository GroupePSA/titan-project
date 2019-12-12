/////////////////
// File upload //
/////////////////

// When we want to disable file upload
function fileUploadDisabled() {
    $('#upload_logfile').val("")
    $('#upload_logfile').show()
    $('#upload_logfile_cancel').hide()
    remote_file_hash = undefined
    inputEditor.setReadOnly(false)
    saveSession()
}

// When we want to disable file upload, and clean the input data field
function fileUploadDisabledClean() {
    inputEditor.getSession().setValue("", -1)
    fileUploadDisabled()
}

// When we want to enable file upload
function fileUploadEnabled(hash, content) {
    $('#upload_logfile').hide()
    $('#upload_logfile_cancel').show()
    remote_file_hash = hash
    inputEditor.setReadOnly(true)

    if (content != undefined) {
        var logfile_content_cut = "<-- Only the first 200 lines of your log file are displayed here -->\n"

        var all_lines = content.split('\n')
        var lines_sliced = all_lines.slice(0, 200)

        logfile_content_cut += lines_sliced.join('\n')

        var total_lines_number = all_lines.length
        var total_lines_displayed = lines_sliced.length

        var go_to_line = logfile_content_cut.endsWith('\n') ? "" : '\n'
        logfile_content_cut += go_to_line + "<-- Displayed " + total_lines_displayed + "/" + total_lines_number + " lines of your log file -->"
        inputEditor.getSession().setValue(logfile_content_cut, -1)
    }

    saveSession()
}

// Read the content of a single file, and put it into the editor
function sendLogfileToBackend(e) {
    readSingleFile(e, (content) => {

        var md = forge.md.sha512.create();
        md.update(content);
        var hash = md.digest().toHex()

        fileUploadEnabled(hash)

        remoteLogExists(hash, (exists) => {
            if (!exists) {
                uploadLogFile(hash, content, (succeed) => {
                    if (!succeed) {
                        var notifError = toastr.error('Unable to upload your log file', 'Error')
                        fileUploadDisabledClean()
                        redirectToastrClick(notifError, "input_data_title")
                    } else {
                        var notifSuccess = toastr.success('Your log file is now stored on the server', 'Success')
                        fileUploadEnabled(hash, content)
                        redirectToastrClick(notifSuccess, "input_data_textarea")
                    }
                })
            } else {
                var notif = toastr.info('Your log file already was on the server', 'Done')
                fileUploadEnabled(hash, content)
                redirectToastrClick(notif, "input_data_textarea")
            }
        })
    })
}


// Upload a log file
function uploadLogFile(hash, content, callback) {
    var body = {
        hash: hash,
        file_content: content
    }
    $.ajax({
        url: api_url + "/file/upload",
        type: "POST",
        data: JSON.stringify(body),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            callback(data.succeed)
        },
        error: function () {
            jobFailed()
            fileUploadDisabledClean()
        }
    });
}

// Check if a Logfile exists on remote server, send result in callback
function remoteLogExists(hash, callback) {
    var body = {
        hash: hash
    }
    $.ajax({
        url: api_url + "/file/exists",
        type: "POST",
        data: JSON.stringify(body),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            return callback(data.exists == true)
        },
        error: function () {
            jobFailed()
        }
    });
}

// Trigger for upload a file
document.getElementById('upload_logfile').addEventListener('change', sendLogfileToBackend, false);


// Trigger for upload a file
$('#upload_logfile_cancel').click(function () {
    fileUploadDisabledClean()
});