var assert = require('assert');
var _ = require('lodash');
var Q = require('q');
var path = require('path');
var fs = require('fs');
var rmdir = require('rimraf');
var readFile = Q.denodeify(fs.readFile);
var searchMapHash = require('./generators/search-map-hash');
var searchMap = require('./generators/search-map');
var generator = require("./generate");
var docMap = require('./testDocMap');
var siteConfig = {
	dest: path.join(__dirname, "test_tmp"),
	devBuild: true,
	minify: false,
	parent: "index",
	forceBuild: true
};
var docMapPromise;

describe("bitDocs.generators.searchMap",function(){
	beforeEach(function(done){
		docMapPromise = Q.Promise(function(resolve){
			resolve(_.assign(docMap));
		});
		done();
	});
	afterEach(function(done){
		rmdir(path.join(__dirname,"test_tmp"),done);
	});


	it("(bitDocs.generators.searchMap.searchMap) Generates a searchMap file", function(){
		return docMapPromise.then(function(docMap){
			return searchMap(docMap, siteConfig);
		}).then(function(){
			if(!fs.existsSync(path.join(__dirname,"test_tmp","searchMap.json"))) {
				throw new Error("searchMap.json does not exist");
			} else{
				assert.ok(true, "searchMap.json exists");
			}
		});
	});

	it("(bitDocs.generators.searchMap.searchMap) Strips HTML from the description", function(){
		docMapPromise.then(function(docMap){
			return searchMap(docMap, siteConfig);
		}).then(function(searchMapResult){
			var description = searchMapResult['can-core'].description;
			assert.ok(description.indexOf('span') < 0, 'stripped basic HTML');
			assert.ok(description.indexOf('input') < 0, 'stripped inputs');
		});
	});

	it("bit-docs links should render", function(){
		return docMapPromise.then(function(docMap){
			return searchMap(docMap, siteConfig);
		}).then(function(searchMapResult){
			assert.equal(searchMapResult['can-core'].description.indexOf('[steal-stache]'), -1);
			assert.ok(searchMapResult['can-core'].description.indexOf('<a href="steal-stache.html"') > -1);
		});
	});

	it("(bitDocs.generators.searchMap.searchMapHash) Generates a searchMapHash file", function(){
		return docMapPromise.then(function(docMap){
			return searchMapHash(docMap, siteConfig);
		}).then(function(){
			if(!fs.existsSync(path.join(__dirname,"test_tmp","searchMapHash.json"))) {
				throw new Error("searchMapHash.json does not exist");
			} else{
				assert.ok(true, "searchMapHash.json exists");
			}
		});
	});

	it("(bitDocs.generators.searchMap.searchMapHash) Generates a new hash when the searchMap changes", function(){
		return docMapPromise.then(function(docMap){
			return searchMap(docMap, siteConfig);
		}).then(function(searchMapResult){
			return searchMapHash(searchMapResult, siteConfig).then(function(firstHash){
				if(!fs.existsSync(path.join(__dirname,"test_tmp","searchMapHash.json"))) {
					throw new Error("searchMapHash.json does not exist (1)");
				} else{
					searchMapResult.description = "test " + searchMapResult.description;
					return searchMapHash(searchMapResult, siteConfig).then(function(secondHash){
						if(!fs.existsSync(path.join(__dirname,"test_tmp","searchMapHash.json"))) {
							throw new Error("searchMapHash.json does not exist (2)");
						} else if(firstHash.hash === secondHash){
							throw new Error("searchMapHash.json does not exist (2)");
						}else{
							assert.ok(true, "The hash changed when the search map changed");
						}
					});
				}
			});
		});
	});

	it("(bitDocs.generators.searchMap) Generates searchMap and searchMapHash files", function(){
		return generator(docMapPromise, siteConfig).then(function(){
			if(!fs.existsSync(path.join(__dirname,"test_tmp","searchMap.json"))) {
				throw new Error("searchMapHash.json does not exist");
			} else if(!fs.existsSync(path.join(__dirname,"test_tmp","searchMapHash.json"))) {
				throw new Error("searchMapHash.json does not exist");
			} else{
				assert.ok(true, "seachMap.json and searchMapHash.json exists");
			}
		});
	});

});
