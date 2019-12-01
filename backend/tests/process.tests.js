var expect = require("chai").expect;
const fs = require('fs-extra')

const cleanup = require("../process/cleanup");
const constants = require("../utils/constants")

describe("Process testing", function () {

    describe("cleanup.js", function () {

        it("launch the cleanup function", function (done) {
            cleanup.startCleaningProcess()
            done()
        });

    });

});
