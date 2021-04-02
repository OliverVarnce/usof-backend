const express = require('express');
const router = express.Router();
const {
    allCategories,
    oneCategory,
    categoryPosts,
    addCategory,
    updCategory,
    delCategory,
} = require("../controllers/category");
const { protect } = require("../middlewares/auth");

router.route('/').get(allCategories);
router.route('/:id').get(oneCategory);
router.route('/:id/posts').get(categoryPosts);
router.route('/').post(protect, addCategory);
router.route('/:id').patch(protect, updCategory);
router.route('/:id').delete(protect, delCategory);

module.exports = router;