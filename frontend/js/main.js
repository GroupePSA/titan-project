const api_url = "http://localhost:8081";
const enable_news = true
const enable_file_upload = true
const enable_guess_file = true
const enable_share_conf = true

// Set default values

applyFieldsAttributes()

loadLogstashVersions(function () {
    loadSession()
    loadShareConfigIfNeeded()
})

if(enable_file_upload) {
    $('#file_upload_feature').removeClass('d-none')
}

if(!enable_guess_file) {
    disableGuessFile()
}

if(!enable_share_conf) {
    $('#share_conf_header').addClass('d-none')
    $('#share_conf_box').addClass('d-none')
}