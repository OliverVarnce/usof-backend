const express = require('express');
const router = express.Router();
const {
    login,
    register,
    passreset,
    confirmEmail,
    logout,
    passresetform,
    passresetconfirm
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

router.route("/register").post(register);
router.route("/confirm/:code").get(confirmEmail);
router.route('/login').post(login);
router.route("/password-reset").post(passreset);
router.route('/password-reset/:code').get(passresetform);
router.route("/password-reset/:code/confirm").post(passresetconfirm);
router.route("/logout").post(logout);

module.exports = router;