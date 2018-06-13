module.exports = function(exitCode, stdout, stderr, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;

  if (stdOUT) {
    stdOUT = stdOUT.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdOUT = stdOUT.replace(/(\")/gm, '\\"');
    //Run output is always a bare string, so better to enclose it in a string
    stdOUT = '"' + stdOUT + '"';
  }

  if (stdERR) {
    stdERR = stdERR.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdERR = stdERR.replace(/(\")/gm, '\\"');
    //Run output is always a bare string, so better to enclose it in a string
    stdERR = '"' + stdERR + '"';
  }

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    exitCode: exitCode
  };

  callback(null, result);
}
