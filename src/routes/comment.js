const express = require('express');
const router = express.Router();
const {
    oneComment,
    likesComment,
    addLikeComment,
    updComment,
    delComment,
    delLikeComment
} = require("../controllers/comment");
const { protect } = require("../middlewares/auth");

router.route('/:id').get(oneComment);
router.route('/:id/like').get(likesComment);
router.route('/:id/like').post(protect, addLikeComment);
router.route('/:id').patch(protect, updComment);
router.route('/:id').delete(protect, delComment);
router.route('/:id/like').delete(protect, delLikeComment);

module.exports = router;