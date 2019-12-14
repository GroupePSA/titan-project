// The news
var whatsup = [
    {
        version: 1,
        date: "23 october 2019",
        news: [
            "Improved Logstash 6.x and 7.x performance"
        ]
    },
    {
        version: 2,
        date: "24 october 2019",
        news: [
            "Well, that window",
            "Custom pattern box is now displayed in minimalist mode"
        ]
    },
    {
        version: 3,
        date: "4 december 2019",
        news: [
            "We can now export to Human mode summary of current configuration"
        ]
    },
    {
        version: 4,
        date: "14 december 2019",
        news: [
            "Editors heighs are resizable",
            "Added an option to enable lines-wrapping for editors",
            "Backend cache Logstash job results",
            "10's last sessions are now saved, and accessible through history!",
            "Augment number of lines shown on file upload",
            "Some ace coloration corrections & improvements for Logstash language",
            "New rules & rules correction for parsing advices"
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
    var userVersion = (store.get("version") != undefined ? store.get("version").version : 0)
    var newsText = ""

    var shouldBeDisplayed = false

    for(var i in whatsup) {
        var news = whatsup[i]
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