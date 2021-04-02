require("dotenv").config();
const isEmail = require('isemail');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middlewares/asyncHandler");
const paginate = require('express-paginate');
const sequelize = require('sequelize');
const { Post, Comment, Category, PostTaxonomy, User, LikesPost, LikesComment } = require("../models");

exports.allUsers = asyncHandler(async (req, res, next) => {
    await User.findAndCountAll()
    .then(results => {
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);
            res.status(200).json({
                success: true,
                data: results,
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
            });
        }).catch(err => next(err))
});

exports.oneUser = asyncHandler(async (req, res, next) => {
    const oneuser = await User.findByPk(req.params.id, {
        attributes: [
            "id",
            "full_name",
            "login",
            "avatar"
        ],
    });
    if (!oneuser) {
        return next({
            message: `No user found for ID - ${req.params.id}`,
            statusCode: 404,
        });
    }

    let arrVotesP = [];
    const votesP = await LikesPost.findAll({
        duplicating: false,
        attributes: ['count',
            [
                sequelize.fn(
                    'SUM',
                    sequelize.col('count'),
                ),
                'total'
            ]
        ],
        group: ['LikesPost.id'],
        include: [
            {
                model: Post,
                attributes: ['id'],
                where: { authorId: req.params.id },
            },
        ],
        raw:true

    }).then(count => {
       count.forEach(key => {
           arrVotesP.push(key.count);
        });
    });

    const votesС = await LikesComment.findAll({
        duplicating: false,
        attributes: ['count',
            [
                sequelize.fn(
                    'SUM',
                    sequelize.col('count'),
                ),
                'total'
            ]
        ],
        group: ['LikesComment.id'],
        include: [
            {
                model: Comment,
                attributes: ['id'],
                where: { authorId: req.params.id },
            },
        ],
        raw:true

    }).then(count => {
        count.forEach(key => {
            arrVotesP.push(key.count);
        });
    });

    let rating = 0;
    for(let i = 0;i <  arrVotesP.length; i++){
        rating = rating + parseInt( arrVotesP[i]);
    }

    res.status(200).json({ success: true, data: oneuser, rating: rating});
});

exports.createUser = asyncHandler(async (req, res, next) => {
    const { login, password, full_name, email} = req.body;
    let role = req.body.role;
    const hashPass = await bcrypt.hash(password, 10)
    const validEmail = isEmail.validate(email, {errorLevel: true});

    if (validEmail > 0) {
        return next({
            message: `Email is not valid`,
            statusCode: 200,
        })
    }

    if (!role) {
        role = 'user';
    }

    await User.create({
        login: login,
        password: hashPass,
        full_name: full_name,
        email: email,
        role: role,
    })
    res.status(200).json({success: true});
});

exports.updAvatar = asyncHandler(async (req, res, next) => {
    const avatar = req.file.filename;
    await User.update({avatar: avatar}, {where: { id: req.user.id } })

    res.status(200).json({success: true});
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const {login, password, full_name, email, rating, role} = req.body;
    const userId = req.params.id
    let data = {};

    const hashPass = await bcrypt.hash(password, 10)
    const validEmail = isEmail.validate(email, {errorLevel: true})

    const checkLogin = await User.findOne({ where: { login } })
    const checkEmail = await User.findOne({ where: { email } })

    if (checkLogin && checkLogin.login === req.params.login && checkLogin.id != req.params.id){
        return next({
            message: `Login is exists`,
            statusCode: 400,
        });
    }

    if (checkLogin && checkLogin.email === req.params.email && checkEmail.id != userId){
        return next({
            message: `Email is exists`,
            statusCode: 400,
        });
    }

    if (validEmail !== 0) {
        return next({
            message: `Email not valid`,
            statusCode: 400,
        });
    }

    if (login !== undefined) {
        data['login'] = login;
    }
    if (password !== undefined) {
        data['password'] = hashPass;
    }
    if (full_name !== undefined) {
        data['full_name'] = full_name;
    }
    if (email !== undefined) {
        data['email'] = email;
    }
    if (rating !== undefined) {
        data['rating'] = rating;
    }
    if (role !== undefined) {
        data['role'] = role;
    }

    const updUsr = await User.update(data, {where: ({id: userId})});

    if (updUsr[0] === 1) {
        res.status(200).send('User updated')
    } else {
        res.status(400).send('Could not update user')
    }
});


exports.delUser = asyncHandler(async (req, res, next) => {

    const delUser = User.destroy({
        where: {id: req.params.id}
    });

    if (delUser !== null) {
        res.status(200).json({ success: true, data: {} });
    } else {
        return next({
            message: `Could not deleted user`,
            statusCode: 400,
        });
    }
});
