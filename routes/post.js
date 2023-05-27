const express = require('express');
const router = express.Router();

const postController = require('../controllers/post_controller');

router.get('/post', postController.post)
router.get('/comment', postController.comment)
router.get('/feedback', postController.feedback)




module.exports = router