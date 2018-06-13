/* Reusing the tslint parser without writing a new parser.

 * Only the command differs in the stage of findandruntslint rest of the functionality is same 

 * So we are reusing the already available tslint parser code

*/
module.exports = require('./tslint.parser');