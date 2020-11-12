// Build the yaml file from 
function convertDevToTest(parent, array) {

    var isRootEventLevel = (parent == "")

    var fieldsToSkip = []
    var events = {
        "ignore": [],
        "testcases": []
    }

    if (isRootEventLevel) {
        fieldsToSkip = ["[message]", "[@version]"]
    }

    for (var i = 0; i < array.length; i++) {
        var line = array[i]
        if (line.startsWith("{") && line.endsWith("}")) {
            var obj = JSON.parse(line)

            var fields = {}

            for (var key in obj) {
                var value = obj[key]
                var fullKey = (isRootEventLevel ? "" : parent) + "[" + key + "]"
                if (typeof value == "object" && !Array.isArray(value)) {
                    tmp_fields = convertDevToTest(fullKey, [JSON.stringify(value)])
                    Object.assign(fields, tmp_fields)
                } else if (!fieldsToSkip.includes(fullKey)) {
                    if (isRootEventLevel) {
                        if(key == "@timestamp") {
                            try {
                                date = Date.parse(value)
                                time_diff = Date.now()-date
                                if(time_diff > 60000 && time_diff <= 0) {
                                    fields[key] = value
                                } else {
                                  fieldsToSkip.push("@timestamp")
                                }
                            } catch (e) {}
                        } else {
                            fields[key] = value
                        }
                    } else if(!/\[@_metadata\]/.test(fullKey)) {
                        fields[fullKey] = value
                    }
                }
            }

            if (isRootEventLevel) {
                var event = {
                    "input": (isRootEventLevel && "message" in obj ? [obj["message"]] : None),
                    "expected": [fields]
                }
                events["testcases"].push(event)

                for(var j=0, x=fieldsToSkip.length; j<x ;j++){
                    var value = fieldsToSkip[j]
                    if (value.split("[").length == 2) {
                        value = value.replace(/\[|\]/g, "")
                    }
                    if (!events["ignore"].includes(value)) {
                        events["ignore"].push(value)
                    }
                }
                   
            }

        }
    }

    if(isRootEventLevel) {
        return events
    } else {
        return fields
    }

}

function convertTestToDev(yamlRaw) {
    result = ""
    data = {}
    try {
        data = jsyaml.safeLoad(yamlRaw)
    } catch (e) {
        toast.error("Failed to parse your dev conf, is that valid YAML ?", "Error")
    }

    try {
        if (data != {}) {
            if ("testcases" in data) {
                for (var i in data["testcases"]) {
                    testcase = data["testcases"][i]
                    if ("input" in testcase && typeof Array.isArray(testcase["input"])) {
                        for (var j in testcase["input"]) {
                            result = result + testcase["input"][j] + "\n"
                        }
                    }
                }
            } else {
                toast.error("Unable to find any testcases", "Error")
            }
        }
    } catch(e) {
        toast.error("Failed to restore your line, is your format correct ?", "Error")
    }

    if (result.endsWith("\n")) {
        result = result.slice(0, -1)
    }

    return result
}

function buildConvertTrigger() {
    // Change theme button rtrigger
    $('#convert').click(function () {
        if (mode == "dev") {
            console.debug("Building model for test")
            if(logstash_output.length != 0) {
                res = convertDevToTest("", logstash_output)
                switchMode()
                inputEditor.getSession().setValue(jsyaml.safeDump(res, options={
                    "noRefs": true,
                    "lineWidth": 1000,
                    "schema": jsyaml.JSON_SCHEMA
                }), -1)
                resizeEditorForContent(inputEditor, 50)
                jumpTo("input_data_title")
            } else {
                toast.error("You need to launch the process before being able to convert it!", "Error")
            }
        } else {
            console.debug("Building input sample for dev")
            content = inputEditor.getSession().getValue()
            res = convertTestToDev(content)
            switchMode()
            inputEditor.getSession().setValue(res)
            resizeEditorForContent(inputEditor, 20)
            jumpTo("input_data_title")
        }
    });
}