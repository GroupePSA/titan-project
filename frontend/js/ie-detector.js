// Check if browser is Internet Explorer
function isIE() {
    var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object
    var msie = ua.indexOf('MSIE '); // IE 10 or older
    var trident = ua.indexOf('Trident/'); //IE 11

    return (msie > 0 || trident > 0);
}


// Show alert if it's IE
if(isIE()){
    alert("Due to his old age, Internet Explorer is no more supported. Please use Firefox or Chrome with this website.");
 }