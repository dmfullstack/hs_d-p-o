/* Reusing the karma parser without writing a new parser.

 * Only the command differs in the stage of findandrunkarma rest of the functionality is same 

 * So we are reusing the already available karma parser code

*/
module.exports = require('./karma.parser');