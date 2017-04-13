/**
 * Override the finishCallback so we can add some cleanup methods.
 * This is run after all tests have been completed.
 */
var server = require('../../bin/www.js');
var _finishCallback = jasmine.Runner.prototype.finishCallback;
jasmine.Runner.prototype.finishCallback = function () {
    // Run the old finishCallback
    _finishCallback.bind(this)();
    // add your cleanup code here...
    server.closeServer();
    done();
};

beforeEach(function(){
  process.env.NODE_ENV='test';
});
