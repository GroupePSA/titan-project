var expect = require("chai").expect;
const fs = require('fs-extra')

const constants = require("../utils/constants")
var system = require("../utils/system")
const logger = require("../utils/logger").logger;

describe("Utils testing", function () {

    describe("system.js", function () {

        it("fail to write a file", function (done) {
            system.writeStringToFile(null, "/fds/fds/fs", "abc", (err) => {
                expect(err).not.to.be.null
                done()
            })
        });

        it("write to a file with a logger", function (done) {
            system.writeStringToFile(logger, "/fds/fds/fs", "abc", (err) => {
                expect(err).not.to.be.null
                done()
            })
        });

        it("fail to delete a file", function (done) {
            system.deleteFile(null, "/fds/fds/fs", (err) => {
                expect(err).not.to.be.null
                done()
            })
        });

        it("fail to delete a file with logger", function (done) {
            system.deleteFile(logger, "/fds/fds/fs", (err) => {
                expect(err).not.to.be.null
                done()
            })
        });

        it("delete a file", function (done) {
            var filepath = "/tmp/test-file-dfs";
            system.writeStringToFile(null, filepath, "abc", (err) => {
                expect(err).to.be.null
                system.deleteFile(null, filepath, (err) => {
                    expect(err).to.be.null
                    done()
                })
            })
        });

        it("cleanup files older than X with success", function (done) {
            system.writeStringToFile(null, constants.LOGFILES_DIR + "/test.file", "abc", (err) => {
                expect(err).to.be.null
                setTimeout(function() {
                    system.deleteFilesOlderThan(constants.LOGFILES_DIR, 1)
                    done()
                }, 5);
            })
        });

    });

});
