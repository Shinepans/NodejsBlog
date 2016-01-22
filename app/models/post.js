var mongodb = require('./db');

function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

//save blog and other infomation
Post.prototype.save = function(callback) {
    var date = new Date();
    //save time
    var time = {
        
            year : date.getFullYear(),
            month : date.getFullYear() + "-" + (date.getMonth() + 1),
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
    }
    //save values
    var post = {
            name: this.name,
            time: time,
            title: this.title,
            post: this.post
    };
    //open mongodb
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //read posts
        db.collection('posts', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            } 
            //insert the blog to posts
            collection.insert(post, {
                safe: true
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);//faulr ,back err info
                }
                callback(null);// back err (null)
            });
        });
    });
};

//read posts and other info
Post.get = function(name, callback) {
    //open mondodb
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //read posts collection
        db.collection('posts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            // use query serch posts
            collection.find(query).sort({
                time: -1
            }).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);//fault ,back err
                }
                callback(null, docs);// true, back collections, use jquery ,back to views, use jade engine!
            });
        });
    });
};