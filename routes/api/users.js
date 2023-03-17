var express = require('express');
var router = express.Router();
var postController = require('../../controllers/postController')

/* GET users listing. */
router.get('/',postController.getAllPost);

module.exports = router;
