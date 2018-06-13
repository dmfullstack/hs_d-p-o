module.exports = function(cmd, input, {stdout, stderr, exitCode}, callback) {
  let stdOUT = stdout;
  let stdERR = stderr;

  // console.log('Paring MOCHA STDOUT *[', stdout, ']*');
  if(!stdERR) stdERR = "";

  if (stdOUT) {
    //exited safely
    stdOUT = stdOUT.replace(/(\r\n|\n|\r|\t)/gm, "");

    let start = stdOUT.indexOf('['),
      end = stdOUT.lastIndexOf(']');

    if (start >= 0 && (end >= 0 && end <= stdOUT.length)) {
      //Extract the identified json part from the overall text
      let jsonOUT = stdOUT.substring(start, end + 1);

      // console.log('Extracted json *[', jsonOUT, ']*');
      try {
        //Parse to validate its a json, stringify back, so that it is transportable
        stdOUT = JSON.stringify(JSON.parse(jsonOUT));
      } catch (err) {
        console.log('Unable to parse output json error: ', err);
        stdOUT = stdout;
        stdERR += "[** ERROR **] Unable to parse output, please verify config and try..!";
      }
    }
  }

  // console.log('Parsed output **[', stdOUT, ']**');

  if (stdERR) {
    stdERR = stdERR.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdERR = stdERR.replace(/(\")/gm, '\\"');
    //Build output is always a bare string, so better to enclose it in a string
    stdERR = '"' + stdERR + '"';
  }

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    exitCode: exitCode
  };

  callback(null, result);
}
