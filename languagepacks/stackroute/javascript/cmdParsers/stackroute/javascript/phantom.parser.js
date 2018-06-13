module.exports = function(exitCode, stdout, stderr, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;

  // console.log('Paring MOCHA STDOUT *[', stdout, ']*');

  if (stdOUT) {
    //exited safely
    stdOUT = stdOUT.replace(/(\r\n|\n|\r|\t)/gm, "");

    let start = stdOUT.indexOf('{'),
      end = stdOUT.lastIndexOf('}');

    if (start >= 0 && (end >= 0 && end <= stdOUT.length)) {
      //Extract the identified json part from the overall text
      let jsonOUT = stdOUT.substring(start, end + 1);

      // console.log('Extracted json *[', jsonOUT, ']*');
      try {
        //Parse to validate its a json, stringify back, so that it is transportable
        stdOUT = JSON.stringify(JSON.parse(jsonOUT));
      } catch (err) {
        console.log('Unable to parse output json error: ', err);
        stdERR += "[** ERROR **] Unable to parse output, remove console logs (if any) and try...!";
        stdOUT = stdOUT.replace(/(\")/gm, '\\"');
        stdOUT = '"' + stdOUT + '"';
      }
    } else {
      stdOUT = stdOUT.replace(/(\")/gm, '\\"');
      stdOUT = '"' + stdOUT + '"';
    }
  }

  if (stdERR) {
    stdERR = stdERR.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdERR = stdERR.replace(/(\")/gm, '\\"');
    //Build output is always a bare string, so better to enclose it in a string
    stdERR = '"' + stdERR + '"';
  }

  // console.log('Parsed output **[', stdOUT, ']**');

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    exitCode: exitCode
  };

  callback(null, result);
}
