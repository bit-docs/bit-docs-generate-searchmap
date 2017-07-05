var fs = require('fs');
var path = require('path');
var filename = require("../util/filename");
var Q = require('q');
var writeFile = Q.denodeify(fs.writeFile);
var mkdirs = Q.denodeify(require("fs-extra").mkdirs);
var striptags = require("striptags");
var bitDocsHelpers = require('bit-docs-generate-html/build/make_default_helpers');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
	
/**
 * @function bitDocs.generators.searchMap.searchMap
 * @parent bitDocs.generators.searchMap.methods
 *
 * Writes out a simplified [documentjs.process.docMap docMap] to be used for searching.
 *
 * @signature `searchMap(docMap, siteConfig)`
 *
 * @param {documentjs.process.docMap} docMap
 * @param {Object} siteConfig
 * @return {Promise} Resolves when searchMap has been written.
 */
module.exports = function(docMap, siteConfig) {
	return new Promise(function(resolve, reject) {
		var searchMap = {};
		var name;
		for (name in docMap) {
			if (docMap.hasOwnProperty(name)) {
				var docObj = docMap[name];
				var helpers = bitDocsHelpers(docMap, siteConfig, function(){
					return docObj;
				}, {});
				
				var description = helpers.makeHtml(docObj.description);
				description = helpers.makeLinks(description);
				description = entities.decode(description);
				description = striptags(description,
					// Allowed tags
					['a', 'em', 'code']
				);

				var searchObj = {
					name: docObj.name,
					title: docObj.title,
					description: description,
					url: filename(docObj, siteConfig),
					dest: 'doc/'
				};
				searchMap[name] = searchObj;
			}
		}

		var dest = path.join(siteConfig.dest, 'searchMap.json');

		mkdirs(siteConfig.dest).then(function(){
			writeFile(dest, JSON.stringify(searchMap)).then(function(){
				resolve(searchMap);
			}, reject);
		}, reject);
	});
};
