//////////////////////
// Theme management //
//////////////////////

// Theme colors

// Enable the black theme
function enableBlackTheme() {
  editor.setTheme("ace/theme/dracula");
  inputEditor.setTheme("ace/theme/dracula");

  inputLineGrokEditor.setTheme("ace/theme/dracula");
  grokPatternEditor.setTheme("ace/theme/dracula");

  $('#css_theme_bootstrap').attr('href', './static/bootswatch/darkly/bootstrap.min.css');
  $('#css_theme_custom').attr('href', './css/custom-black.css');

  editor.setTheme("ace/theme/dracula");
  inputEditor.setTheme("ace/theme/dracula");

  console.log("Enable black theme")
}

// Enable the white theme
function enableWhiteTheme() {
  editor.setTheme("ace/theme/clouds");
  inputEditor.setTheme("ace/theme/chrome");

  inputLineGrokEditor.setTheme("ace/theme/clouds");
  grokPatternEditor.setTheme("ace/theme/clouds");

  $('#css_theme_bootstrap').attr('href', './static/bootswatch/flatly/bootstrap.min.css');
  $('#css_theme_custom').attr('href', './css/custom.css');

  editor.setTheme("ace/theme/clouds");
  inputEditor.setTheme("ace/theme/chrome");

  console.log("Enable white theme")
}

// Change theme button rtrigger
$('#change_theme').click(function () {
  if ($('#css_theme_bootstrap').attr('href').includes('flatly')) {
    enableBlackTheme()
    saveSession()
  } else {
    enableWhiteTheme()
    saveSession()
  }
  document.location.reload(true);
});

// Minimalist mode

// Enable the minimalist mode
function enableMinimalistMode() {
  $('#css_theme_minimalist').attr('href', './css/custom-minimalist.css');

  console.log("Enable minimalist mode")
}

// Disable the minimalist mode
function disableMinimalistMode() {
  $('#css_theme_minimalist').attr('href', './css/custom-nominimalist.css');

  console.log("Disable minimalist mode")
}

// Change minimalist mode button trigger
$('#change_minimalist').click(function () {
  if ($('#css_theme_minimalist').attr('href').includes('nominimalist.css')) {
    enableMinimalistMode()
    saveSession()
    toastr.success("Enabled minimalist mode", "Success")
  } else {
    disableMinimalistMode()
    saveSession()
    toastr.success("Disabled minimalist mode", "Success")
  }
});

// Fullscreen mode

// Enable the fullscreen mode
function enableFullscreenMode() {
  $('#main_container').removeClass("container")
  $('#main_container').addClass("container-fluid")

  console.log("Enabled fullscreen mode")
}

// Disable the fullscreen mode
function disableFullscreenMode() {
  $('#main_container').removeClass("container-fluid")
  $('#main_container').addClass("container")

  console.log("Disabled fullscreen mode")
}

// Change fullscreen mode button trigger
$('#change_fullscreen').click(function () {
  if ($('#main_container').hasClass("container")) {
    enableFullscreenMode()
    saveSession()
    toastr.success("Enabled fullscreen mode", "Success")
  } else {
    disableFullscreenMode()
    saveSession()
    toastr.success("Disabled fullscreen mode", "Success")
  }
});


// Text wrapping mode

// Enable the text wrapping mode
function enableTextWrappingMode() {
  $('#css_theme_text_wrapping').attr('href', './css/custom-text-wrapping.css');

  console.log("Enabled text wrapping mode")
}

// Disable the text wrapping mode
function disableTextWrappingMode() {
  $('#css_theme_text_wrapping').attr('href', './css/custom-no-text-wrapping.css');

  console.log("Disabled text wrapping mode")
}

// Change text wrapping mode button trigger
$('#change_text_wrapping').click(function () {
  if ($('#css_theme_text_wrapping').attr('href').includes('no-text-wrapping.css')) {
    enableTextWrappingMode()
    saveSession()
    toastr.success("Enabled text wrapping line mode", "Success")
  } else {
    disableTextWrappingMode()
    saveSession()
    toastr.success("Disabled text wrapping line mode", "Success")
  }
});

// Parsing advices mode

var enableParsingAdvices = true

// Enable the parsing advices mode
function enableParsingAdvicesMode() {
  enableParsingAdvices = true

  console.log("Enabled parsing advices mode")
}

// Disable the parsing advices mode
function disableParsingAdvicesMode() {
  enableParsingAdvices = false

  console.log("Disabled parsing advices mode")
}

// Change text wrapping mode button trigger
$('#change_parsing_advices').click(function () {
  if (!enableParsingAdvices) {
    enableParsingAdvicesMode()
    saveSession()
    toastr.success("Enabled parsing advices mode", "Success")
  } else {
    disableParsingAdvicesMode()
    saveSession()
    toastr.success("Disabled parsing advices mode", "Success")
  }
});

// Redirect the user to a specific anchor in the page

function jumpTo(anchor) {
  window.location.href = "#" + anchor;
}

// Redirect click for a toastr event for a specific anchor

function redirectToastrClick(element, anchor) {
  $(element).click(function () {
    jumpTo(anchor)
  });
}