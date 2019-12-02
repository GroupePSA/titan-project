//////////////////
// Form control //
//////////////////

var logstash_output = ""
var remote_file_hash = undefined

// Manage list of extra fields

// Apply conf of extra input fields
function applyFieldsAttributes(conf) {
  var oldValues = "";
  var number = "";

  if (conf == undefined) {
    oldValues = getFieldsAttributesValues()
    number = $('#fields_attributes_number').val();
  } else {
    oldValues = conf;
    number = conf.length;
    $('#fields_attributes_number').val(number);
  }

  $('#fields_attributes').empty();
  for (var i = 0; i < number; i++) {
    var attr = "";
    var val = "";
    if (i < oldValues.length) {
      attr = oldValues[i].attribute != undefined ? oldValues[i].attribute : ""
      val = oldValues[i].value != undefined ? oldValues[i].value : ""
    }
    var str = '<div class="form-group row" style="margin-top: 1em">';
    str += '<div class="col-lg-4"><input type="text" class="form-control log-display" id="field_attribute_key_' + i + '" size="20" name="p_scnt" value="' + attr + '" placeholder="Attribute ' + (i + 1) + '" /></div>';
    str += '<div class="col-lg-7"><input type="text" class="form-control log-display" id="field_attribute_value_' + i + '" size="20" name="p_scnt" value="' + val + '" placeholder="Value ' + (i + 1) + '" /></div>';
    str += '<div class="col-lg-1"><a onclick="deleteFieldAttribute(' + i + ')"><i class="fas fa-times text-danger" style="padding-top: 0.7em"></i></a></div>';
    str += '</div>';
    $('#fields_attributes').append(str);
  }
}

// Get value of extra input files
function getFieldsAttributesValues() {
  var number = $('#fields_attributes_number').val();
  var values = []
  for (var i = 0; i < number; i++) {
    values.push({
      attribute: $('#field_attribute_key_' + i).val(),
      value: $('#field_attribute_value_' + i).val()
    });
  }
  return values
}

// Delete a field attribute
function deleteFieldAttribute(i) {
  var attributes = getFieldsAttributesValues()
  attributes.splice(i, 1)
  applyFieldsAttributes(attributes)
}

// Trigger on the fields attribute number
$("#fields_attributes_number").change(function () {
  applyFieldsAttributes()
});

// Manage the custom multiline codec

// Enable the multiline codec
function enableMultilineCodec(value) {
  if (value != undefined) {
    $('#custom_codec_field').val(value)
  }
  $('#enable_custom_codec').prop('checked', true);
  $('#custom_codec_field').removeClass('d-none');
}

// Disable the multiline codec
function disableMultilineCodec() {
  $('#custom_codec_field').addClass('d-none');
  $('#custom_codec_field').val("");
  $('#enable_custom_codec').prop('checked', false);
}

// Trigger on the multiline codec checkbox
$('#enable_custom_codec').change(function () {
  if (this.checked) {
    enableMultilineCodec()
  } else {
    disableMultilineCodec()
  }
});

// Check for input logs with empty lines at the end, and inform user in consequences

function checkInputLogsEnding() {
  var input_data = inputEditor.getSession().getValue().split("\n")

  if(input_data.length > 0) {
    var lastLine = input_data[input_data.length - 1]
    if (lastLine.length == 0 || /^s*$/.test(lastLine)) {
      var notif = toastr.info('If it is expected, don\'t bother, but otherwise, it may cause some parsing problems.', 'Your log file ends with empty lines', { timeOut: 10000 })
      redirectToastrClick(notif, "input_data_textarea")
    }
  }
}

// Validate the user input

function userInputValid() {
  var input_valid = true;
  var input_warning = false;
  var redirectToLocation = null;

  var error_reason = "All fields need to be fill !"
  var error_title = 'Informations missings'
  var error_opt = {}
  
  var input_data = inputEditor.getSession().getValue()
  var logstash_filter = editor.getSession().getValue();

  if (input_data.length == 0) {
    $('#input_data_title').addClass("text-danger");
    input_valid = false;
    redirectToLocation = "input_data_textarea"
  } else {
    $('#input_data_title').removeClass("text-danger");
  }


  var logstash_filter_lines = logstash_filter.split("\n")
  var logstashFilterError = false
  for (var i in logstash_filter_lines) {
    var line = logstash_filter_lines[i]
    if (/^\s*patterns_dir\s*=>/.test(line)) {
      error_reason = "The parameter <b>patterns_dir</b> was commented into <i>Grok</i> bloc(s).<br>Please use the custom Logstash pattern box to add your customs Grok patterns."
      input_warning = true
    } else if (/^\s*patterns_files_glob\s*=>/.test(line)) {
      error_reason = "The parameter <b>patterns_files_glob</b> was commented into <i>Grok</i> bloc(s).<br>Please use the custom Logstash pattern box to add your customs Grok patterns."
      input_warning = true
    } else if (/^\s*dictionary_path\s*=>/.test(line)) {
      logstashFilterError = true
      error_reason = "The parameter <b>dictionary_path</b> is not supported into <i>Translate</i> blocs.<br>You can either refractor you code to remove this bloc, or embed your dictionnary values into the bloc."
    }
  }

  if(logstashFilterError || input_warning) {
    error_title = "Non-compatible parameter"
    error_opt = { 
      timeOut: 10000
    }
  }

  if (logstash_filter.length == 0 || logstashFilterError) {
    $('#logstash_filter_title').addClass("text-danger");
    redirectToLocation = "logstash_filter_textarea"
    input_valid = false;
  } else {
    $('#logstash_filter_title').removeClass("text-danger");
  }

  var fieldsAttributes = getFieldsAttributesValues()
  var fieldsAttributesValids = true

  for (var j = 0; j < fieldsAttributes.length; j++) {
    if (fieldsAttributes[j].attribute == "" || fieldsAttributes[j].value == "") {
      input_valid = false;
      fieldsAttributesValids = false;
      $('#input_extra_attributes').addClass("text-danger");
      redirectToLocation = "input_extra_attributes"
      break;
    }
  }

  if (fieldsAttributesValids) {
    $('#input_extra_attributes').removeClass("text-danger");
  }

  if ($('#enable_custom_codec').is(':checked')) {
    var custom_codec_value = $('#custom_codec_field').val()
    if (custom_codec_value.length == 0) {
      input_valid = false;
      $('#custom_codec_field').addClass("is-invalid");
      redirectToLocation = "custom_codec_field"
    } else {
      $('#custom_codec_field').removeClass("is-invalid");
    }
  }

  if (!input_valid) {
    var notifError = toastr.error(error_reason, error_title, error_opt)
    redirectToastrClick(notifError, redirectToLocation)
  } else if (input_warning) {
    var notifWarning = toastr.warning(error_reason, error_title, error_opt)
    redirectToastrClick(notifWarning, redirectToLocation)
  }

  checkInputLogsEnding()

  return input_valid
}

// Update the filter value
function updateFilter() {
  saveSession()
  refreshLogstashLogDisplay()
}

// Trigger for the search filter value
$('#filter_display').on('input', (function () {
  updateFilter()
}))

// Trigger for the search filter type
$('#filter_regex_enabled').change(function () {
  updateFilter()
})

// Trigger for the reverse match filter type
$('#filter_reverse_match_enabled').change(function () {
  updateFilter()
})

// Trigger for the limit display change
$('#number_lines_display').change(function () {
  updateFilter()
})