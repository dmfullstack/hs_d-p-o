/* Reusing the build parser without writing a new parser.

 * Only the command differs in the stage of findandbuild rest of the functionality is same 

 * So we are reusing the already available build parser code

*/
module.exports = require('./build.parser');
