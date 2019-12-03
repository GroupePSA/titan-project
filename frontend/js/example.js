// We define here the examples we want to show
var examples = [
    // Simple examples
    {
        category: "Simple examples",
        examples: [
            // Single Line (Syslog)
            {
                name: "Syslog",
                description: "A simple example on how to parse a basic syslog file format.",
                input_data_filepath: "./sample/simple/data.txt",
                filter_filepath: "./sample/simple/filter.conf",
                input_data_attributes: [
                    { attribute: "pilote", value: "system" },
                    { attribute: "type", value: "syslog" },
                    { attribute: "path", value: "/var/log/syslog" }
                ],
                custom_codec_filepath: undefined
            },
            // Multiline (Java Stack Trace)
            {
                name: "Multiline strack trace",
                description: "A sample on how to use a custom codec (here multiline) with this web tool.",
                input_data_filepath: "./sample/multiline/data.txt",
                filter_filepath: "./sample/multiline/filter.conf",
                input_data_attributes: [
                    { attribute: "type", value: "java-stack-trace" }
                ],
                custom_codec_filepath: "./sample/multiline/multiline.codec"
            },
        ]
    },

    // Simple examples
    {
        category: "Dissect",
        examples: [
            // Basic syslog
            {
                name: "Simple example",
                description: "An example to show how to parse a syslog file using dissect.",
                input_data_filepath: "./sample/dissect-simple/data.txt",
                filter_filepath: "./sample/dissect-simple/filter.conf",
                input_data_attributes: [
                    { attribute: "pilote", value: "system" },
                    { attribute: "type", value: "syslog" }
                ],
                custom_codec_filepath: undefined
            },
            // Basic csv
            {
                name: "CSV Parsing example",
                description: "An example on how to parse a CSV file using dissect.",
                input_data_filepath: "./sample/dissect-csv/data.txt",
                filter_filepath: "./sample/dissect-csv/filter.conf",
                input_data_attributes: [],
                custom_codec_filepath: undefined
            },
        ]
    }

]

// Factory method to generate examples
function exampleFactory(conf) {
    if (conf.input_data_filepath != undefined) {
        $.ajax({
            url: conf.input_data_filepath,
            success: function (data) {
                inputEditor.getSession().setValue(data, -1)
            }
        });
    }

    if (conf.filter_filepath != undefined) {
        $.ajax({
            url: conf.filter_filepath,
            success: function (data) {
                editor.getSession().setValue(data, -1);
            }
        });
    }

    if (conf.input_data_attributes != undefined) {
        applyFieldsAttributes(conf.input_data_attributes)
    }

    if (conf.custom_codec_filepath != undefined) {
        $.ajax({
            url: conf.custom_codec_filepath,
            success: function (data) {
                enableMultilineCodec(data)
            }
        });
    } else {
        disableMultilineCodec()
    }

    fileUploadDisabled()

}

// Init display of examples
function initExamples() {
    $('#examples_select').empty();
    for (var categoryId in examples) {
        var category = examples[categoryId].category
        $('#examples_select').append("<optgroup label='" + category + "'>")
        for (var exampleId in examples[categoryId].examples) {
            var example = examples[categoryId].examples[exampleId]
            $('#examples_select').append("<option>" + example.name + "</option>")
        }
        $('#examples_select').append("</optgroup>")
    }
    updateExamplesDescription()
}

// Get current selected example
function getSelectedExample() {
    var selectedText = $('#examples_select :selected').text();

    for (var categoryId in examples) {
        for (var exampleId in examples[categoryId].examples) {
            var example = examples[categoryId].examples[exampleId]
            if (example.name == selectedText) {
                return example
            }
        }
    }
    return undefined
}

// Show the current description of the example
function updateExamplesDescription() {
    var example = getSelectedExample()

    if(example != undefined) {
        $("#example_description").text(example.description)
    } else {
        console.debug("Unable to find the example")
    }
}

// Check if an url exists
function urlExists(url, callback){
    $.ajax({
      type: 'HEAD',
      url: url,
      success: function(){
        callback(true);
      },
      error: function() {
        callback(false);
      }
    });
}

var extra_examples_url = "/js/custom/extra_examples.js"

urlExists( extra_examples_url, function(exists) {
    if (exists) {
        var others_examples = null

        $.getScript( extra_examples_url, function( data, textStatus, jqxhr ) {
            if (data != null) {
                eval(data);
            }
            if(others_examples != null) {
                examples.push(...others_examples)
            }
            initExamples()
    });
    } else {
        console.debug("No extra examples found")
        initExamples()
    }
})

// We update the description on example change
$("#examples_select").change(function () {
    updateExamplesDescription()
});

// We set-up a trigger to apply examples
$("#show_example").click(function () {
    var example = getSelectedExample()

    if(example != undefined) {
        exampleFactory(example)
        toastr.success("Successfully loaded your example", "Success")
        jumpTo("input_extra_attributes")
    } else {
        toastr.error("Failed to load your example", "Error")
    }
});