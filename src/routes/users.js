const express = require('express');
const router = express.Router();
const {
    allUsers,
    oneUser,
    createUser,
    updAvatar,
    updateUser,
    delUser,
} = require("../controllers/user");
const { protect } = require("../middlewares/auth");
const { passValidator } = require("../middlewares/passValidator");
const uploader = require("../middlewares/uploader");

router.route('/').get(protect, allUsers);
router.route('/').post(protect, passValidator, createUser);
router.route('/:id').get(protect, oneUser);
router.route('/avatar').post(protect, uploader.single('avatar'), updAvatar);
router.route('/:id').patch(protect, updateUser);
router.route("/:id").delete(protect, delUser);

module.exports = router;
