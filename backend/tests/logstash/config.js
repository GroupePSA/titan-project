const MAX_TIMEOUT = 60000;

var enable_slow_tests = process.env.SLOW_TEST || "true";
enable_slow_tests = (["false", "f", "no"].includes(enable_slow_tests.toLowerCase()) ? false : true)

const logstashVersion = process.env.LOGSTASH_VERSION || "6.8.3";

module.exports = {
    MAX_TIMEOUT: MAX_TIMEOUT,
    enable_slow_tests: enable_slow_tests,
    logstashVersion: logstashVersion
}