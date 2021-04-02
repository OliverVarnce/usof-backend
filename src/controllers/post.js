require("dotenv").config();

const { Post, Comment, Category, PostTaxonomy, User, LikesPost, Favorites } = require("../models");
const asyncHandler = require("../middlewares/asyncHandler");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const paginate = require('express-paginate');
const sendMail = require('../services/sendMail');

exports.allPosts = async (req, res, next) => {
    const { sort, order } = req.query;

    if (!req.query.limit){
        req.query.limit = 2;
    }

    await Post.findAndCountAll(
        {
            limit: req.query.limit,
            offset: req.skip,
            include: [
                {
                    model: LikesPost,
                    required: true,
                    attributes: ['count'],
                }],
            order: [[LikesPost, 'count', 'ASC']],
        })
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
}

exports.onePost = async (req, res,next) => {
    const onePost = await Post.findByPk(req.params.id);

    if (!onePost) {
        return next({
            message: `No post found`,
            statusCode: 404,
        });
    }

    res.status(200).json({ success: true, data: onePost });
}

exports.postComments = async (req, res) => {
    await Comment.findAndCountAll({
        where: {postId: req.params.id},
        limit: req.query.limit,
        offset: req.skip,
        order: [['CreatedAt', 'DESC']],
    })
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
    }).catch(err => next(err));
}

exports.addComment = asyncHandler(async (req, res, next) => {
    const { content } = req.body;


    await Comment.create({
        comment: content,
        postId: req.params.id,
        authorId: req.user.id,
        createdAt: new Date().now,
        updatedAt: new Date().now
    });

    const newComment = await Comment.findAll({where: { postId: req.params.id }});

    let emlArr = [];

    await User.findAll ({
            attributes: ['email'],
            include: [
                {
                    model: Favorites,
                    where: {postId: req.params.id}
                }
            ],
        raw: true
        }
    ).then(eml => {
        eml.forEach(key => {
            emlArr.push(key.email);
        });
    })

    console.log(emlArr);

    emlArr.forEach((el) => {
        const message = {
            to: el,
            subject: 'New Comment',
            html: `<h2>A new comment in your favorite post<h2>
                    <a href="http://localhost:3000/api/posts/${req.params.id}  "> Go to this link for see this!</a>
                    <br>
                    <i>Don't repeat this mail!</i>`
        }
        sendMail(message);
    })

    res.status(200).json({ success: true, data: newComment});

});

exports.postCategories = async (req, res) => {
    try {
        const postCats = await Category.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('name')), 'name'],
            ].concat(Object.keys(Category.rawAttributes)),
            exclude: ['name'],
            include: [
                {
                    model: PostTaxonomy,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: Post,
                            required: true,
                            attributes: [],
                            where: { id: req.params.id }
                        }],
                }],
            });
        return res.status(200).json({ success: true, data: postCats});
    } catch (e) {
        console.log(e);
        return res.status(500)
    }
}

exports.getLikes = async (req, res, next) => {
    const likes = await LikesPost.findOne({
        where: {
            postId: req.params.id
        },
        attributes: ['count']
    });

    if(!likes) {
        return next ({
            status: 200,
            message: "no likes"
        });
    }
    return res.status(200).json({ success: true, data: likes});
}
exports.addPost = asyncHandler(async (req, res) => {
    const {title, body, categories} = req.body;
    const verifyUser = await User.findOne({where: {id: req.user.id}});

    if (verifyUser.id) {
        const newPost = await Post.create({
            authorId: verifyUser.id,
            title: title,
            published: 1,
            story: body,
            createdAt: new Date().now,
            updatedAt: new Date().now,
        });

        const cats = categories.split(',');

        try {
            cats.forEach((cat) => {
                PostTaxonomy.create({
                    postId: newPost.id,
                    categoryId: cat
                });
            })
            await LikesPost.create({postId: newPost.id, count: 0})
        } catch (e){
            console.log(e);
        }
    }
    return res.status(200).json({ success: true, data: "Post is published"});
});

exports.addLike = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const getLikes = await LikesPost.findOne({where: { postId: id } });
    await LikesPost.update({ count: getLikes.count + 1},{where: {postId: id} });
    return res.status(200).json({ success: true, data: getLikes.count + 1});
});

exports.updPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const params = {};
    const author = await Post.findOne({where: { id: id }});
    const role = await User.findOne({where: { id: req.user.id }, attributes:[ 'role' ] });

    Object.entries(req.body).forEach(param => {
        let key = param[0];
        const val = param[1];

        if (key !== 'id') {
            if (key === 'body') {
                key = 'story';
            }
            params[key] = val;
        }
            params.updatedAt = new Date().now;
    });

    if(role.role !== 'admin' && author.authorId !== userId.id) {
        return next ({
            status: 403,
            message: "You can not change this post!"
        });
    }


    await Post.update(params, {where: {id: id}});

    const updatedPost = await Post.findByPk(id);

    res.status(200).json({ success: true, data: updatedPost});

});
exports.delPost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const author = await Post.findOne({ where: { id: id } });
    const role = await User.findOne({ where: { id: req.user.id }, attributes:[ 'role' ] });

    if(role.role !== 'admin' && author.authorId !== userId.id) {
        return next ({
            status: 403,
            message: "You can not delete this post!"
        });
    }

    const checkPost = await Post.findByPk(id);

    if(!checkPost) {
        return next ({
            status: 404,
            message: "Post not found!"
        });
    }
    await Post.destroy({where: {id: id}});
    res.status(200).json({ success: true});

});

exports.delPostLike = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const getLikes = await LikesPost.findOne({where: { postId: id } });

    await LikesPost.update({ count: getLikes.count - 1},{where: {postId: id} });
    return res.status(200).json({ success: true, data: getLikes.count - 1});
});

exports.addPostToFavorites = asyncHandler(async (req, res, next) => {
     const checkUnique = Favorites.findAll({where: {id: req.params.id, userId: req.user.id}});

    if (checkUnique.id) {
        return next ({
            status: 400,
            message: "Your post is already in you favorites list!"
        });

    }

    await Favorites.create(
        {
            postId: req.params.id,
            userId: req.user.id,
        });

    return res.status(200).json({ success: true});
});

exports.delPostToFavorites = asyncHandler(async (req, res, next) => {
    await Favorites.destroy({
        where: {
            postId: req.params.id,
            userId: req.user.id,
        }
    });

    return res.status(200).json({ success: true});
});

exports.allFavorites = asyncHandler(async (req, res, next) => {
    const favoritesList = await Post.findAll({
        include: [
            {
                model: Favorites,
                where: {
                    userId: req.user.id,
                }
            }
        ],
    });

    return res.status(200).json({ success: true, data: favoritesList});
});