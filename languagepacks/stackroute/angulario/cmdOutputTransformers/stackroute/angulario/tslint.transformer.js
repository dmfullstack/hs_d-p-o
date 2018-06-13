module.exports = function({stdout, stderr, exitCode}, callback) {
  let stdERR = stderr;
  let stdOUT = stdout;

  let resultArr = [];
  try {
    resultArr = JSON.parse(stdOUT);
  } catch (err) {
    console.log("Error in parsing result output for eslint transform ", err);
    resultArr = []; //Set results to empty, so that no parsing is done
  }

  let violationsList = [];
  resultArr.forEach((violtaion, index, array) => {
  //console.log(violtaion)
  // for the first index we are creating the structure we required
  // messages is to store violation details
  if(index < 1){
    let obj = {
      "messages": []
    };
    let obj2 = {};

    obj.filePath = violtaion.name;
    obj2.ruleId   = violtaion.ruleName;
    obj2.severity = (violtaion.ruleSeverity === "ERROR") ? 2 : 1;
    obj2.message  = violtaion.failure;
    obj2.line     = violtaion.startPosition.line;
    obj2.column   = violtaion.startPosition.position;
    obj.messages.push(obj2);
    violationsList.push(obj);
    return;

   // Checking the filepath of current object and previous object
   // if same no need create new object just taking violation line and column and rule
   // added to existing array(messages)
  } else if(index > 0 && array[index].name === array[index-1].name) {

    let messages = [];
    violationsList.forEach((uniqueViolation, innerIndex, fullarray) => {
      if(uniqueViolation.filePath === violtaion.name){
        let obj2 = {};
        obj2.ruleId   = violtaion.ruleName;
        obj2.severity = (violtaion.ruleSeverity === "ERROR") ? 2 : 1;
        obj2.message  = violtaion.failure;
        obj2.line     = violtaion.startPosition.line;
        obj2.column   = violtaion.startPosition.position;
        messages.push(obj2);
        fullarray[innerIndex].messages.push(obj2);
      }
    })
    // for different filepath it creates new objects and messages array
    // messages is to store violation details
  } else {
    let obj = {
      "messages": []
    };
    let obj2 = {};

    obj.filePath = violtaion.name;
    obj2.ruleId   = violtaion.ruleName;
    obj2.severity = (violtaion.ruleSeverity === "ERROR") ? 2 : 1;
    obj2.message  = violtaion.failure;
    obj2.line     = violtaion.startPosition.line;
    obj2.column   = violtaion.startPosition.position;
    obj.messages.push(obj2);
    violationsList.push(obj);
    return;
  }

})

  stdOUT = JSON.stringify(violationsList);

  let result = {
    stdout: stdOUT,
    stderr: stdERR,
    exitCode: exitCode
  }

  //result.stdout = JSON.stringify(eslint);
  callback(null, result);
}
