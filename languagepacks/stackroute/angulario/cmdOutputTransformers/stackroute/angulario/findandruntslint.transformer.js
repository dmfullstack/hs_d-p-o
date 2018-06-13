/* Reusing the tslint transformer without writing a new transformer.

 * Only the command differs in the stage of findandruntslint rest of the functionality is same 

 * So we are reusing the already available tslint transformer code

*/
module.exports = require('./tslint.transformer');