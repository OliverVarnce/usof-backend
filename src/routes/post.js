const express = require('express');
const router = express.Router();
const {
    allPosts,
    onePost,
    postComments,
    addComment,
    postCategories,
    getLikes,
    addPost,
    addLike,
    updPost,
    delPost,
    delPostLike,
    allFavorites,
    addPostToFavorites,
    delPostToFavorites
} = require("../controllers/post");
const { protect } = require("../middlewares/auth");

router.route('/').get(allPosts);
router.route('/:id').get(onePost);
router.route('/:id/comments').get(postComments);
router.route('/:id/comments').post(protect, addComment);
router.route('/:id/categories').get(postCategories);
router.route('/:id/like').get(getLikes);
router.route('/').post(protect, addPost);
router.route('/:id/like').post(protect, addLike);
router.route('/:id').patch(protect, updPost);
router.route('/:id').delete(protect, delPost);
router.route('/:id/like').delete(protect, delPostLike);

//act creative
router.route('/:id/favorites').get(protect, allFavorites);
router.route('/:id/favorites').post(protect, addPostToFavorites);
router.route('/:id/favorites').delete(protect, delPostToFavorites);

module.exports = router;
