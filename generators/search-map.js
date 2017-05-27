var fs = require('fs'),
	path = require('path'),
	filename = require("../util/filename"),
	Q = require('q'),
	writeFile = Q.denodeify(fs.writeFile),
	mkdirs = Q.denodeify(require("fs-extra").mkdirs),
	striptags = require('striptags'),
	commonmark = require('commonmark'),
	markdownParser = new commonmark.Parser(),
	markdownRenderer = new commonmark.HtmlRenderer();

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
	var searchMap = {},
		name;
	for (name in docMap) {
		if (docMap.hasOwnProperty(name)) {
			var docObj = docMap[name];
			var description = markdownParser.parse(docObj.description);
			description = markdownRenderer.render(description);
			description = striptags(description);
	
			var searchObj = {
				name: docObj.name,
				title: docObj.title,
				description: description,
				url: filename(docObj, siteConfig)
			};
			searchMap[name] = searchObj;
		}
	}

	var dest = path.join(siteConfig.dest, 'searchMap.json');

	return mkdirs(siteConfig.dest).then(function(){
		return writeFile(dest, JSON.stringify(searchMap)).then(function(){
			return searchMap;
		});
	});

};
