/* Reusing the karma checkParser without writing a new checkParser.

 * Only the command differs in the stage of findandrunkarma rest of the functionality is same 

 * So we are reusing the already available karma checkParser code

*/
module.exports = require('./karma.checkParser');