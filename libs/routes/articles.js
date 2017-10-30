const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

const express = require('express');
const passport = require('passport');
const router = express.Router();
const CacheService = require(libs + '/services/CacheService');

const db = require(libs + 'db/mongoose');
const Article = require(libs + 'model/article');

router.get('/', passport.authenticate('bearer', { session: false }), function(req, res) {
	
	let limit = parseInt(req.headers['x-item-limit']);
	let skip = parseInt(req.headers['x-page-number']);

	limit = (!Number.isNaN(limit) && typeof limit === 'number') ? limit : 10;
	skip  = (!Number.isNaN(skip) && typeof skip === 'number') ? skip : 0;

	let cacheKey = `${skip}-${limit}`;
	getFromCache(cacheKey).then((data) => {
		if(data) {
			res.set('x-cached', 'true');
			res.json(data);
		}
		else {
			Article.find().sort({name: 'asc'}).skip(skip).limit(limit).exec(function (err, articles) {
				if (!err) {
					storeInCache(cacheKey, articles);
					res.json(articles);
				} else {
					res.statusCode = 500;
					
					log.error('Internal error(%d): %s',res.statusCode,err.message);
					
					res.json({
						error: 'Server error' 
					});
				}
			});
		}
	});
});

router.post('/', passport.authenticate('bearer', { session: false }), function(req, res) {
	
	var article = new Article({
		title: req.body.title,
		author: req.body.author,
		description: req.body.description,
		images: req.body.images
	});

	article.save(function (err) {
		if (!err) {
			log.info("New article created with id: %s", article.id);
			return res.json({ 
				status: 'OK', 
				article:article 
			});
		} else {
			if(err.name === 'ValidationError') {
				res.statusCode = 400;
				res.json({ 
					error: 'Validation error' 
				});
			} else {
				res.statusCode = 500;
				
				log.error('Internal error(%d): %s', res.statusCode, err.message);
				
				res.json({ 
					error: 'Server error' 
				});
			}
		}
	});
});

router.get('/:id', passport.authenticate('bearer', { session: false }), function(req, res) {
	
	Article.findById(req.params.id, function (err, article) {
		
		if(!article) {
			res.statusCode = 404;
			
			return res.json({ 
				error: 'Not found' 
			});
		}
		
		if (!err) {
			return res.json({ 
				status: 'OK', 
				article:article 
			});
		} else {
			res.statusCode = 500;
			log.error('Internal error(%d): %s',res.statusCode,err.message);
			
			return res.json({ 
				error: 'Server error' 
			});
		}
	});
});

router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res){
	var articleId = req.params.id;

	Article.findById(articleId, function (err, article) {
		if(!article) {
			res.statusCode = 404;
			log.error('Article with id: %s Not Found', articleId);
			return res.json({ 
				error: 'Not found' 
			});
		}

		article.title = req.body.title;
		article.description = req.body.description;
		article.author = req.body.author;
		article.images = req.body.images;
		
		article.save(function (err) {
			if (!err) {
				log.info("Article with id: %s updated", article.id);
				return res.json({ 
					status: 'OK', 
					article:article 
				});
			} else {
				if(err.name === 'ValidationError') {
					res.statusCode = 400;
					return res.json({ 
						error: 'Validation error' 
					});
				} else {
					res.statusCode = 500;
					
					return res.json({ 
						error: 'Server error' 
					});
				}
				log.error('Internal error (%d): %s', res.statusCode, err.message);
			}
		});
	});
});

module.exports = router;


/*
 In these two functions we don't care about failures.
 The backend will be significantly slower, but it _has_ to return the results.
*/

function getFromCache(key) {
	return new Promise(resolve => {
		CacheService.fetch(key).then((data) => {
			if(data !== null) {
				log.info(`Found ${key} in cache`);
				resolve(data);
			}
			else {
				log.info(`Missing ${key} in cache, fetching from DB`);
				resolve(null);
			}
		}).catch((err) => { 
			log.warn(err);
			resolve(null);
		});
	});

};

function storeInCache(key, value, ttl) {
	return new Promise(resolve => {
		CacheService.store(key, value, ttl).then(res => {
			resolve();
		}).catch((err) => { 
			log.warn(err);
			resolve();
		});
	});
}