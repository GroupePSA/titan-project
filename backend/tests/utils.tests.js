var expect = require("chai").expect;
const fs = require('fs-extra')

const constants = require("../utils/constants")
var system = require("../utils/system")
var string = require("../utils/string")
var tddUtils = require("../utils/tdd-utils")
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

    describe("string.js", function () {

        it("compute length of a string", function (done) {
                var str = "abc\bdef\nghi"
                expect(string.numberOfLinesString(str)).to.equal(3)
                done()
        })

    });

    describe("tdd-utils.js", function () {

        it("cleanup of tdd output", function (done) {
                var output = 'Running tests in data.yml...\nComparing message 1 of 2 from data.yml...\n{\n  "@timestamp": "2015-10-06T20:55:29.000Z",\n  "host": "myhost",\n  "message": "This is a test message",\n  "pid": 31993,\n  "program": "myprogram",\n  "type": "syslog"\n}\n{\n  "@timestamp": "2020-02-14T21:42:27.166Z",\n  "host": "localhost",\n  "message": "Oct  6 20:55:29 myhost myprogram[31993]: This is a test message",\n  "test": "test2",\n  "type": "syslog"\n}\nComparing message 2 of 2 from data.yml...\n{\n  "@timestamp": "2015-10-06T20:55:29.000Z",\n  "host": "myhost",\n  "message": "This is a test message",\n  "program": "myprogram",\n  "type": "syslog"\n}\n{\n  "@timestamp": "2020-02-14T21:42:27.170Z",\n  "host": "localhost",\n  "message": "Oct  6 20:55:29 myhost myprogram: This is a test message",\n  "test": "test2",\n  "type": "syslog"\n}\n'
                var [fakeOutput, testCases] = tddUtils.cleanTDDOutput(output)

                var outputLines = fakeOutput.split("\n")
                expect(outputLines.length).to.equal(2)
                var line1 = JSON.parse(outputLines[0])
                var line2 = JSON.parse(outputLines[1])

                var expectedEvent1 = {
                    "@timestamp": "2020-02-14T21:42:27.166Z",
                    "host": "localhost",
                    "message": "Oct  6 20:55:29 myhost myprogram[31993]: This is a test message",
                    "test": "test2",
                    "type": "syslog" 
                }
                var expectedEvent2 = {
                    "@timestamp": "2020-02-14T21:42:27.170Z",
                    "host": "localhost",
                    "message": "Oct  6 20:55:29 myhost myprogram: This is a test message",
                    "test": "test2",
                    "type": "syslog"
                }
                expect(line1).to.be.deep.equal(expectedEvent1)
                expect(line2).to.be.deep.equal(expectedEvent2)

                expect(testCases.length).to.equal(2)
                var expected1 = JSON.parse(testCases[0].expected)
                var expected2 = JSON.parse(testCases[1].expected)


                expect(JSON.parse(testCases[0].real)).to.be.deep.equal(expectedEvent1)
                expect(expected1).to.be.deep.equal({
                    "@timestamp": "2015-10-06T20:55:29.000Z", 
                    "host": "myhost", 
                    "message": "This is a test message", 
                    "pid": 31993, 
                    "program": "myprogram", 
                    "type": "syslog"
                })
                expect(JSON.parse(testCases[1].real)).to.be.deep.equal(expectedEvent2)
                expect(expected2).to.be.deep.equal({
                    "@timestamp": "2015-10-06T20:55:29.000Z",
                    "host": "myhost",
                    "message": "This is a test message",
                    "program": "myprogram",
                    "type": "syslog"
                })


                done()
        })

        it("cleanup of tdd output should never fail", function (done) {
            var output = ''
            var [fakeOutput, testCases] = tddUtils.cleanTDDOutput(output)

            expect(fakeOutput).to.be.equal("")
            expect(testCases.length).to.be.equal(0)
            
            done()
        })

        it("cleanup of tdd output should not fail on non-expected message", function (done) {
            var output = 'fds\nfds\nfds'
            var [fakeOutput, testCases] = tddUtils.cleanTDDOutput(output)

            expect(fakeOutput).to.be.equal(output)
            expect(testCases.length).to.be.equal(0)

            var output2 = 'Running tests in data.yml...\nComparing message 1 of 2 from data.yml...\n{\n  "@timestamp": "2015-10-06T20:55:29.000Z",\n  "host": "myhost",\n  "message": "This is a test message",\n  "pid": 31993,\n'
            var expectedOutput2 = 'Comparing message 1 of 2 from data.yml...\n{\n  "@timestamp": "2015-10-06T20:55:29.000Z",\n  "host": "myhost",\n  "message": "This is a test message",\n  "pid": 31993,\n'
            var [fakeOutput2, testCases2] = tddUtils.cleanTDDOutput(output2)

            expect(fakeOutput2).to.be.equal(expectedOutput2)
            expect(testCases2.length).to.be.equal(0)

            var output3 = 'Running tests in data.yml...\nComparing message 1 of 2 from data.yml...\n{\n  "@timestamp": "2015-10-06T20:55:29.000Z",\n  "host": "myhost",\n  "message": "This is a test message",\n  "pid": 31993,\n  "program": "myprogram",\n  "type": "syslog"\n}\nComparing message 2 of 2 from data.yml...\n{\n  "@timestamp": "2015-10-06T20:55:29.000Z",\n  "host": "myhost",\n  "message": "This is a test message",\n  "program": "myprogram",\n  "type": "syslog"\n}\n{\n  "@timestamp": "2020-02-14T21:42:27.170Z",\n  "host": "localhost",\n  "message": "Oct  6 20:55:29 myhost myprogram: This is a test message",\n  "test": "test2",\n  "type": "syslog"\n}\n'
            var expectedOutput3 = 'Comparing message 1 of 2 from data.yml...\n{\n  "@timestamp": "2015-10-06T20:55:29.000Z",\n  "host": "myhost",\n  "message": "This is a test message",\n  "pid": 31993,\n  "program": "myprogram",\n  "type": "syslog"\n}\n{   "@timestamp": "2020-02-14T21:42:27.170Z",   "host": "localhost",   "message": "Oct  6 20:55:29 myhost myprogram: This is a test message",   "test": "test2",   "type": "syslog" }'
            var [fakeOutput3, testCases3] = tddUtils.cleanTDDOutput(output3)
            expect(fakeOutput3).to.be.equal(expectedOutput3)
            expect(testCases3.length).to.be.equal(1)
            
            done()
        })

    });


});
