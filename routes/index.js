var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if (req.user){
    res.render('index',{user: req.user});
  }else
    res.render('index');
});

// router.get('/login', function(req,res,next){
//   res.render('login')
// })

module.exports = router;
