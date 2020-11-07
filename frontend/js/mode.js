// Parsing advices mode

var mode = "dev"

// Enable the dev mode
function enableDevMode(config) {
  mode = "dev"

  $('#change_mode').bootstrapToggle('on', true)
  loadModeSpecificity((config != undefined ? config : getConfig()))
  inputEditor.session.setMode("ace/mode/elixir");

  if(enable_file_upload) {
    $('#file_upload_feature').removeClass('d-none')
  }
  $('#data_explorer_container').removeClass('d-none')
  $('#column_result_search').removeClass('d-none')
  $('#column_result_display_limit').removeClass('d-none')

  $('#input_data_title').text("Logs:")
  $('#input_data_title_description').html("You can copy/paste here your logs. You don't need to have lots of them, <strong>only keep representative logs</strong> of your formats. You should not have more than about 100 lines of logs.")
  $('#output_description').text("The data process by Logstash will be displayed here.")

  if($("#number_events_displayed").val().trim() != "") {
    $("#number_events_displayed_container").removeClass('d-none')
  }

  console.debug("Enabled dev mode")
}

// Enabled the test mode
function enableTestMode(config) {
  mode = "test"

  $('#change_mode').bootstrapToggle('off', true)
  loadModeSpecificity((config != undefined ? config : getConfig()))
  inputEditor.session.setMode("ace/mode/yaml");

  if(enable_file_upload) {
    $('#file_upload_feature').addClass('d-none')
  }
  $('#data_explorer_container').addClass('d-none')
  $('#column_result_search').addClass('d-none')
  $('#column_result_display_limit').addClass('d-none')

  $('#input_data_title').text("Configuration:")
  $('#input_data_title_description').html("Your configuration from the <a target='_blank' href='https://github.com/magnusbaeck/logstash-filter-verifier/tree/1.6.0'>logstash-filter-verifier</a> project come here. YAML configuration only is supported.")
  $('#output_description').text("The testcases will be displayed here.")

  $("#parsing_advices").addClass('d-none')
  $('#number_events_displayed_container').addClass('d-none')

  console.debug("Enabled test mode")
}   

// Switch current mode
function switchMode() {
  if (mode == "dev") {
    enableTestMode()
    saveSession()
    toastr.success("Enabled test mode", "Success")
  } else {
    enableDevMode()
    saveSession()
    toastr.success("Enabled dev mode", "Success")
  }
  refreshLogstasOutputDisplay()
}

// Change text wrapping mode button trigger
$('#change_mode').change(function () {
  switchMode()
});

// Define a handler for the Switch mode keyboard shortcut
function doc_keyUp(e) {

  // CTRL + B
  if (e.ctrlKey && e.keyCode == 66) {
    switchMode()
  }
}

// Register the shortcut handler 
document.addEventListener('keyup', doc_keyUp, false);