
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
    str += '<div class="col"><input type="text" class="form-control log-display" id="field_attribute_key_' + i + '" size="20" name="p_scnt" value="' + attr + '" placeholder="Attribute ' + (i + 1) + '" /></div>';
    str += '<div class="col"><input type="text" class="form-control log-display" id="field_attribute_value_' + i + '" size="20" name="p_scnt" value="' + val + '" placeholder="Value ' + (i + 1) + '" /></div>';
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
  $('#enable_custom_codec').attr('checked', true);
  $('#custom_codec_field').removeClass('d-none');
}

// Disable the multiline codec
function disableMultilineCodec() {
  $('#custom_codec_field').addClass('d-none');
  $('#custom_codec_field').val("");
  $('#enable_custom_codec').attr('checked', false);
}

// Trigger on the multiline codec checkbox
$('#enable_custom_codec').change(function () {
  if (this.checked) {
    enableMultilineCodec()
  } else {
    disableMultilineCodec()
  }
});

// Validate the user input

function userInputValid() {
  input_valid = true;

  var input_data = $('#input_data_textarea').val();
  var logstash_filter = editor.getValue();

  if (input_data.length == 0) {
    $('#input_data_textarea').addClass("is-invalid");
    input_valid = false;
  } else {
    $('#input_data_textarea').removeClass("is-invalid");
  }

  if (logstash_filter.length == 0) {
    $('#logstash_filter_title').addClass("text-danger");
    input_valid = false;
  } else {
    $('#logstash_filter_title').removeClass("text-danger");
  }

  fieldsAttributes = getFieldsAttributesValues()
  fieldsAttributesValids = true

  for (var i = 0; i < fieldsAttributes.length; i++) {
    if (fieldsAttributes[i].attribute == "" || fieldsAttributes[i].value == "") {
      input_valid = false;
      fieldsAttributesValids = false;
      $('#input_extra_attributes').addClass("text-danger");
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
    } else {
      $('#custom_codec_field').removeClass("is-invalid");
    }
  }

  if (!input_valid) {
    toastr.error('All fields need to be fill !', 'Informations missings')
  }

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