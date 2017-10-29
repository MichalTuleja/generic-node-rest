var faker = require('faker');

var libs = process.cwd() + '/libs/';

var log = require(libs + 'log')(module);
var db = require(libs + 'db/mongoose');
var config = require(libs + 'config');

var User = require(libs + 'model/user');
var Client = require(libs + 'model/client');
var Article = require(libs + 'model/article');
var AccessToken = require(libs + 'model/accessToken');
var RefreshToken = require(libs + 'model/refreshToken');


Promise.all(
    [
        generateUser(), 
        generateClient(), 
        generateArticles(200), 
        removeTokens()
    ]
).then(retValues => {
    log.info('Job finished.');
    db.disconnect();
}).catch(err => {
    log.error(err);
});

function generateUser() {
    return new Promise((resolve, reject) => {
        User.remove({}, function(err) {
            var user = new User({ 
                username: config.get("default:user:username"), 
                password: config.get("default:user:password") 
            });
            
            user.save(function(err, user) {
                if(!err) {
                    log.info("New user - %s:%s", user.username, user.password);
                    resolve(user);
                }else {
                    log.error(err);
                    reject(err);
                }
            });
        });
    });
}

function generateClient() {
    return new Promise((resolve, reject) => {
        Client.remove({}, function(err) {
            var client = new Client({ 
                name: config.get("default:client:name"), 
                clientId: config.get("default:client:clientId"), 
                clientSecret: config.get("default:client:clientSecret") 
            });
            
            client.save(function(err, client) {
                if(!err) {
                    log.info("New client - %s:%s", client.clientId, client.clientSecret);
                    resolve(client);
                } else {
                    log.error(err);
                    reject(err);
                }
            });
        });
    });
}

function generateArticle() {
    return new Promise((resolve, reject) => {
        Article.remove({}, function(err) {
            var article = new Article({ 
                title: faker.lorem.words().join(' '),
                author: faker.lorem.words(2).join(' '),
                description: faker.lorem.words(16).join(' '),
                images: []
            });
            
            article.save(function(err, article) {
                if(!err) {
                    log.info("New article - %s:%s", article.title, article.author);
                    resolve(article);
                } else {
                    return log.error(err);
                }
            });
        });
    });
}

function removeTokens() {
    return new Promise((resolve, reject) => {
        Promise.all(
            [
                () => {
                    AccessToken.remove({}, function (err) {
                        if (err) {
                            return log.error(err);
                        }
                    });
                },
                () => {
                    RefreshToken.remove({}, function (err) {
                        if (err) {
                            return log.error(err);
                        }
                    });
                }
            ]
        ).then(() => { resolve(); });
    });
}

function generateArticles(num) {
    return new Promise((resolve, reject) => {
        let arr = [];
        for(let i = 0; i < num; i++) {
            arr.push(generateArticle());
        }

        Promise.all(arr).then(values => {
            resolve();
        });
    });
}