var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Post = require('../app/models/post');

var multipart =  require('connect-multiparty');
var multipartMiddleware = multipart()


module.exports = function(app) {

  // pre handle user
  app.use(function(req, res, next) {
    var _user = req.session.user

    app.locals.user = _user

    next()
  })

  app.get('/',Index.index);

  app.get('/shake',Index.shake);
  app.post('/user/blog', function (req, res) {
  var currentUser = req.session.user,
      post = new Post(currentUser.name, req.body.blogTitle, req.body.blogPost);
  post.save(function (err) {
    if (err) {
      
      return res.redirect('/');
    }
    console.log(typeof(post));
    req.flash('success', '发布成功!');
    res.redirect('/');//发表成功跳转到主页
  });
})

  // 
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.showSignin)
  app.get('/signup', User.showSignup)
  app.get('/logout', User.logout)
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)



  // results
  app.get('/results', Index.search)
}