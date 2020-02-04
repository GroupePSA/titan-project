// Compute the number of lines in a string
function numberOfLinesString(str) {
    return str.split(/\r\n|\r|\n/).length
}

module.exports = {
    numberOfLinesString: numberOfLinesString
};
