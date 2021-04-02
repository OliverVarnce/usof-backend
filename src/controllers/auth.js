require("dotenv").config();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");

const isEmail = require('isemail');
const passwordValidator = require('password-validator');
const sendMail = require('../services/sendMail');
const { str_rand } = require("../services/randomizer");

exports.register = asyncHandler(async (req, res, next) => {
    const schema = new passwordValidator();
    const hashPass = await bcrypt.hash(req.body.password, 10)
    const validEmail = isEmail.validate(req.body.email, {errorLevel: true})

    const checkEmail = await User.findOne({ where: { email: req.body.email}})
    const checkLogin = await User.findOne({ where: { login: req.body.login}})

    schema
        .is().min(6)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        //.has().uppercase(0)                              // Must have uppercase letters
        //.has().lowercase(0)                              // Must have lowercase letters
        //.has().digits(0)                                // Must have at least 2 digits
        .has().not().spaces(0)                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123', 'qwerty']); // Blacklist these values

    const validPass = schema.validate(req.body.password);

    if (!validPass){
        return next({
            message: "password may have A-Z,a-z, 0-9, and >6 characters",
            statusCode: 200,
        });
    }

    if (checkEmail) {
        return next({
            message: "The email is yet registered",
            statusCode: 200,
        });
    }

    if (checkLogin) {
        return next({
            message: "The login is yet registered",
            statusCode: 200,
        });
    }


    if (validEmail === 0) {
        const randStr = str_rand();
        await User.create({
            login: req.body.login,
            password: hashPass,
            full_name: req.body.full_name,
            email: req.body.email,
            confirmCode: randStr,
        });

        const message = {
            to: req.body.email,
            subject: 'Confirm email',
            html: `<h2>Congrats! You're registered on USOF<h2>
                    <a href="http://localhost:3000/api/auth/confirm/${randStr}  "> Go to this link for confirm you registration!</a>
                    <br>
                    <i>Don't repeat this mail!</i>`
        }
        sendMail(message);
        res.status(200).send("User registered");
        res.status(200).json({success: true, data: token});
    }
});

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return next({
            message: "The email is not yet registered",
            statusCode: 400,
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return next({ message: "The password does not match", statusCode: 401 });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({ success: true, data: token });
};

exports.logout = async (req, res) => {
        res.send('Logged out');
};

exports.confirmEmail = async (req, res) =>{
    const userByCode = await User.findOne({where: {confirmCode: req.params.code}})

    if (userByCode != null) {
        let updData = {is_confirm: true}
        await User.update(updData, {where: ({id: userByCode.id})})

        res.status(200).send('Email confirmed')
    } else {
        res.status(404).send('User not found')
    }
}

exports.passreset = async (req, res) => {
    try {
        const { email } = req.body;
        const validEmail = isEmail.validate(email, {errorLevel: true});
        const resetToken = str_rand();

        if (validEmail === 0) {
            const user = await User.findOne({ where: { email } })

            if (user !== undefined) {
                await User.update({
                    resetToken: resetToken,
                    expires: Date.now() + 3600000
                }, {where: {id: user.id}})

                const message = {
                    to: email,
                    subject: 'Password reset request',
                    html: `<h2>To change password press the link<h2>
                    <a href="http://localhost:3000/api/auth/password-reset/${resetToken} "> Change password </a>
                    <br>
                    <i>Don't repeat this mail!</i>`
                }
                sendMail(message)
                res.status(201).send("Password reset link send")
            } else {
                res.status(404).send('User not found')
            }
        } else {
            res.status(400).send("email is not valid")
        }
    } catch (e) {
        console.log(e);
    }
};

exports.passresetform = async (req, res) => {
    res.status(200).send(`<div><form method="POST" action="http://localhost:3000/password-reset/${req.params.code}/confirm"><input placeholder="New password" name="password" value=""><button type="submit">SEND</button></form></div>`);
}

exports.passresetconfirm = async (req, res) => {
    try {
        if (req.body.password === undefined) {
            res.status(400).send('password parameter is missing')
            return
        }
        const userByCode = await User.findOne({where: {resetToken: req.params.code}})
        if (userByCode) {
            const hashPass = await bcrypt.hash(req.body.password, 10);

            await User.update({
                password: hashPass,
            }, {where: {id: userByCode.id}})

            res.status(200).send('Password updated')
        } else {
            res.status(404).send('User not found')
        }
    } catch (e) {
        console.log(e)
    }
}
