////////////////////////////////
// Session history management //
////////////////////////////////

// Check if two object content are equals
function deepEqual(a,b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// Create the table for session history
var sessionDatabase = new Dexie("sessionHistory");
sessionDatabase.version(1).stores({ history: "id,value" });

// Save the session history
function saveSessionHistory(session) {
    sessionDatabase.history.update(1, {value: JSON.stringify(session)}).then(function (updated) {
        if (!updated) {
            sessionDatabase.history.add({id: 1, value: JSON.stringify(session)}).catch(function(e) {
                console.debug("Failed to add current session into history")
            })
        }
    });
}

// Save the session history
function getSessionHistory(callback) {
    sessionDatabase.history.where("id").equals(1).first(function(item) {
        if (item == null) {
            callback([])
        } else {
            if("value" in item) {
                callback(JSON.parse(item['value']))
            } else {
                callback([])
            }
        }
    }).catch(function(e) {
        callback([])
    })
}

// Add current session to history
function addSessionToHistory(session) {
    var maxSessionsSaved = 10
    getSessionHistory(function (sessionHistory) {
        for(var i in sessionHistory) {
            var h = sessionHistory[i]
            if(deepEqual(h.session, session)) {
                sessionHistory.splice(i, 1)
                sessionHistory.unshift({
                    "date": Date.now(),
                    "session": session
                })
                setTimeout(function() {
                    console.debug("Writing current session to cache")
                    saveSessionHistory(sessionHistory)
                }, 50); 
                return
            }
        }
    
        if(sessionHistory.length >= maxSessionsSaved) {
            sessionHistory.pop()
        }
    
        sessionHistory.unshift({
            "date": Date.now(),
            "session": session
        })
        console.debug("Writing current session to cache")
        saveSessionHistory(sessionHistory)
    })
}

// Show the session history

function showSessionHistory() {
    $('#sessionHistoryModal').modal('show');
    getSessionHistory(function (sessionHistory) {
        if(sessionHistory.length == 0) {
            $('#sessionHistoryContent').html("No history found.")
            return
        }

        var content = '<div class="list-group list-group-flush">'
        for(var i in sessionHistory) {
            var h = sessionHistory[i]
            var date = new Date(h['date'])
            var humanDate = date.toLocaleDateString() + " " + date.toLocaleTimeString()
            content += '<a href="#" class="list-group-item list-group-item-action" onclick="loadSessionHistory(' + i + ')">' + humanDate + '</a>'
        }
        content += "</div>"
        $('#sessionHistoryContent').html(content)
    })
}

// Load a session history 

function loadSessionHistory(i) {
    getSessionHistory(function (sessionHistory) {
        if(sessionHistory.length < i) {
            toastr.error("Failed to load your session history", "Failure")
            return
        }
        loadConfig(sessionHistory[i].session)
        $('#sessionHistoryModal').modal('hide');
        toastr.success("Successfully loaded your session", "Success")
    })
}