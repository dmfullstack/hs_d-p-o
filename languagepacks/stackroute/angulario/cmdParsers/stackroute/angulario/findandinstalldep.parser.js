/* Reusing the installdep parser without writing a new parser.

 * Only the command differs in the stage of findandinstalldep rest of the functionality is same 

 * So we are reusing the already available installdep parser code

*/
module.exports = require('./installdep.parser')