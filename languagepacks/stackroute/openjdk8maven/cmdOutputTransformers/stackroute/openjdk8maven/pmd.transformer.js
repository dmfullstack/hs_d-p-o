function getLintStructure(fileName, violations){

  let result = {};
  result.filePath = fileName;
  result.messages = violations.map((check)=>{
    let errorMsg = {
      source: check.attributes.externalInfoUrl,
      message: check._,
      column: check.attributes.begincolumn,
      line: check.attributes.beginline,
      // PMD only generates errors where we give an error report when the severity is 2
      severity: 2,
      nodeType: check.attributes.ruleset,
      ruleId: check.attributes.rule
    };
    return errorMsg;
  });
  return result;
}

module.exports = function({cmd, stdout, stderr, exitCode} , callback){
  let stdOUT = stdout;
  let stdERR = stderr;
  let fileOutput = undefined;

  if(!stdERR) stdERR = "";

  if(stdOUT && stdOUT.pmd && stdOUT.pmd.file) {
    let outputArray = stdOUT.pmd.file.map((checkArray)=>{
      return getLintStructure(checkArray.attributes.name, checkArray.violation);
    });
    fileOutput = JSON.stringify(outputArray);
    // console.log("TransformedOutput ", JSON.stringify(outputArray));
  } else {
    stdERR += "[** ERROR **] Unable to parse output, please check and try..!";
  }

  if (stdERR) {
    stdERR = stdERR.replace(/(\r\n|\n|\r|\t)/gm, "");
    stdERR = stdERR.replace(/(\")/gm, '\\"');
    //Build output is always a bare string, so better to enclose it in a string
    stdERR = '"' + stdERR + '"';
  }

  let result = {
    stdout: fileOutput, //if fileOutput was not parsed, it will be undefined
    stderr: stdERR,
    exitCode: exitCode
  }

  callback(null, result);
}
