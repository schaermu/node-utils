var e = require('extensions');

function getLogDate() {
  var date = new Date();

  return date.getDate().pad(2) +
    '/' + date.getMonth().pad(2) +
    '/' + date.getFullYear() + ' ' + date.getHours().pad(2) +
    ':' + date.getMinutes().pad(2) + ':' + date.getSeconds().pad(2);
}

exports.debug = function (msg) {
  if (process.sparkEnv.log.level != 'debug') return;
  if (process.sparkEnv.name == "production") {
    process.sparkEnv.log.debug(msg);
  } else {
    console.log('[' + getLogDate() + '] \x1B[37m\x1B[1mDEBUG:\x1B[0m ' + msg);
  }
};

exports.info = function (msg) {
  if (process.sparkEnv.log.level != 'info' && process.sparkEnv.log.level != 'debug') return;
  if (process.sparkEnv.name == "production") {
    process.sparkEnv.log.info(msg);
  } else {
    console.log('[' + getLogDate() + '] \x1B[32m\x1B[1mINFO:\x1B[0m ' + msg);
  }
};

exports.warn = function (msg) {
  if (process.sparkEnv.log.level != 'warn' && process.sparkEnv.log.level != 'info' && process.sparkEnv.log.level != 'debug') return;
  if (process.sparkEnv.name == "production") {
    process.sparkEnv.log.warn(msg);
  } else {
    console.log('[' + getLogDate() + '] \x1B[33m\x1B[1mWARN:\x1B[0m ' + msg);
  }
};

exports.fatal = function (msg) {
  if (process.sparkEnv.name == "production") {
    process.sparkEnv.log.error(msg);
  } else {
    console.log('[' + getLogDate() + '] \x1B[31m\x1B[1mFATAL:\x1B[0m ' + msg);
  }
};

exports.dump = function (object) {
  if (process.sparkEnv.log.level != 'debug') return;
  console.log(utils.inspect(object));
};