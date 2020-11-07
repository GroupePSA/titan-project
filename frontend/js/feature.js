/////////////
// Feature //
/////////////

function disableGuessFile() {
    $('#column_guess_file').addClass('d-none')
    $('#column_empty_right').addClass('d-none')
    $('#column_clear_form').addClass('col-lg-4')
    $('#column_start_process').addClass('col-lg-4')
}

function enableGuessFile() {
    if(enable_guess_file) {
        $('#column_guess_file').removeClass('d-none')
        $('#column_empty_right').removeClass('d-none')
        $('#column_clear_form').removeClass('col-lg-4')
        $('#column_start_process').removeClass('col-lg-4')
    }
}