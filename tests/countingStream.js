// @see http://codewinds.com/blog/2013-08-19-nodejs-writable-streams.html

const util = require('util');
const streamWritable = require('stream').Writable;

function CountingStream(options) {
  this.bytesWritten = 0;
  this.lines = 0;
  streamWritable.call(this, options);
}
util.inherits(CountingStream, streamWritable);

CountingStream.prototype._write = function(chunk, enc, cb) {
  this.bytesWritten += chunk.length;
  this.lines++;
  if (cb)
    cb();
};


module.exports = CountingStream;
