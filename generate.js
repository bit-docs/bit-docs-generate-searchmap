
var searchMapHash = require("./generators/search-map-hash"),
	searchMap = require("./generators/search-map"),
	Q = require("q");

/**
 * @function bitDocs.generators.searchMap.generate
 * @parent bitDocs.generators.searchMap.methods
 *
 * Generates a searchMap based on the [documentjs.process.docMap docMap]
 * given the docMap and the configuration siteConfig.
 *
 * @signature `.generate(docMapPromise, siteConfig)`
 *
 * @param {Promise<documentjs.process.docMap>} docMapPromise A promise that
 * contains a `docMap` created by [documentjs.process.files].
 * @param {Object} siteConfig Configuration siteConfig.
 *
 * @return {Promise} A promise that resolves when the site has been built.
 */
module.exports = function(docMapPromise, siteConfig){
	
	var searchMapPromise = docMapPromise.then(function(docMap){
		return searchMap(docMap, siteConfig);
	});

	var searchMapHashPromise = searchMapPromise.then(function(searchMap){
		return searchMapHash(searchMap, siteConfig);
	});

	return docsPromise = Q.all([
			docMapPromise,
			searchMapPromise,
			searchMapHashPromise
	]);
};
