const async = require('async');
const nunjucks = require('nunjucks');
nunjucks.configure({ autoescape: false });
const _ = require('lodash');
const retrievePayload = require('../../services/payload/retrievePayload');
const savePayload = require('../../services/payload/updatePayload');

module.exports = function(jobId, stageName, stage, payload, exitCode, stdout, stderr, summary, done) {
  if (!stage.hasOwnProperty('output') ||
    !stage.output.hasOwnProperty('payload')) {
    done(null);
    return;
  }

  // console.log('Updating payload for stage [', stage, '] with ', {exitCode, stdout, stderr});

  let stdOUT = stdout;
  let stdERR = stderr;
  let stageSummary = summary;

  let payloadString = JSON.stringify(stage.output.payload);

  //Escape the templating escape character before rendering the templated fields
  payloadString = payloadString.replace(/(\\)/gm, '');
  payloadString = payloadString.replace(/(\"\{\{)/gm, '\{\{');
  payloadString = payloadString.replace(/(\}\}\")/gm, '\}\}');
  // console.log('Payload String: ', payloadString);

  // offering to replace all the information have at completion of the stage, depending on work-flow definition, these will get replaced
  let payloadPatch = nunjucks.renderString(payloadString, {
    STAGE: stageName,
    EXITCODE: ((exitCode == 0) ? '"Completed"' : '"Failed"'),
    OUTPUT: (stdOUT || "\"\""),
    ERRORS: (stdERR || "\"\""),
    SUMMARY: (stageSummary || "\"\"")
  });

  let parseResult = guardedJSONParse(payloadPatch);
  if (parseResult.error) {
    // Some error, so lets treat STDOUT and STDERR as plain string
    payloadPatch = nunjucks.renderString(payloadString, {
      STAGE: stageName,
      EXITCODE: ((exitCode == 0) ? '"Completed"' : '"Failed"'),
      OUTPUT: ((JSON.stringify(stdOUT)) || "\"\""),
      ERRORS: ((JSON.stringify(stdERR)) || "\"\""),
      SUMMARY: (stageSummary || "\"\"")
    });

    parseResult = guardedJSONParse(payloadPatch);
    if (parseResult.error) {
      //Again error, can't do much now
      console.log("** Persistent issue with parsing STDOUT or STDERR **");
      console.log(`STDOUT: [${stdOUT}]`);
      console.log(`STDERR: [${stdERR}]`);

      payloadPatch = nunjucks.renderString(payloadString, {
        STAGE: stageName,
        EXITCODE: ((exitCode == 0) ? '"Completed"' : '"Failed"'),
        OUTPUT: "Unable to read STDOUT or STDERR..!",
        ERRORS: "Unable to read STDOUT or STDERR..!",
        SUMMARY: (stageSummary || "\"\"")
      });
    } else {
      payloadPatch = parseResult.result;
    }
  } else {
    console.log('Stage:: ', stageName, ' Parsing payload is SMOOTH');
    payloadPatch = parseResult.result
  }
  _.merge(payload, payloadPatch);
  console.log('Stage:: ', stageName, ' Parsing & Merge of payloadPatch is DONE');

  // FIXME: Send only patch, when supported by services/payload/updatePayload.js
  savePayload(jobId, payload, done);
};

const guardedJSONParse = function(strToParse) {
  try {
    strToParse = JSON.parse(strToParse);
    return { error: undefined, result: strToParse };
  } catch (err) {
    // console.log("Caught JSON.parse exception in updatePayload **[", strToParse, "]**");
    return { error: err, result: undefined };
  }
}