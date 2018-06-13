/* Reusing the tslint checkParser without writing a new checkParser.

 * Only the command differs in the stage of findandruntslint rest of the functionality is same 

 * So we are reusing the already available tslint checkParser code

*/
module.exports = require('./tslint.checkParser');