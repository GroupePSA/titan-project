// The news
var whatsup = [
    {
        version: 1,
        date: "23 october 2019",
        news: [
            "Improved Logstash 6.x and 7.x performance"
        ]
    }
]

// Store latest version that user saw
function storeLatestVersionSeen() {
    store.set("version", {
        version: whatsup[whatsup.length - 1].version
    })
}

// Show the modal to inform of user changes if needed
function showWhatsUpIfNeeded() {
    userVersion = (store.get("version") != undefined ? store.get("version").version : 0)
    newsText = ""
    console.log(userVersion)

    shouldBeDisplayed = false

    for(var i in whatsup) {
        news = whatsup[i]
        if (userVersion < news.version) {
            shouldBeDisplayed = true
            newsText += '<h5 style="padding-top: 0.5em; padding-bottom: 0.5em">' + news.date + "</h5>"

            newsText += "<ul>"
            for(var j in news.news) {
                var newFeature = news.news[j]
                newsText += "<li>" + escapeHtml(newFeature) + "</li>"
            }
            newsText += "</ul>"
        }
    }

    $('#whatsupModalContent').html(newsText);

    if(shouldBeDisplayed) {
        $('#whatsupModal').modal('show');
    }
}

// Trigger on modal close
$('#whatsupModal').on('hidden.bs.modal', function () {
    storeLatestVersionSeen()
})