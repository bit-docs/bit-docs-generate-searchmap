var generator = require("./generate");

/**
 * @module {function} bit-docs-generate-searchmap
 * @group bit-docs-generate-searchmap/modules modules
 * @parent plugins
 *
 * @description Generates a searchMap from a docMap.
 *
 * @body
 *
 * TBD
 */
module.exports = function(bitDocs){
    bitDocs.register("generator", generator);
};
