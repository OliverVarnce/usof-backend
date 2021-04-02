require("dotenv").config();

const { Comment, LikesComment, User } = require("../models");
const asyncHandler = require("../middlewares/asyncHandler");
const jwt = require("jsonwebtoken");

exports.oneComment = async (req, res, next) => {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
        return next({
            status: 403,
            message: "Comment not found"
        })
    }

    res.status(200).json({ success: true, data: comment });
}

exports.likesComment = async (req, res) => {
    const { id } = req.params;

    const getLikes = await LikesComment.findOne({ where: { commentId: id }, attributes: ['count'] });

    return res.status(200).json({ success: true, data: getLikes});
}

exports.addLikeComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const token = req.headers.authorization.replace("Bearer", "").trim();
    const userId = jwt.verify(token, process.env.JWT_SECRET);

    const verifyUser = await User.findOne({where: { id: userId.id } });
    const getLikes = await LikesComment.findOne({where: { commentId: id } });

    if (!verifyUser.id) {
        return next({
            message: `Please, log in`,
            statusCode: 401,
        })
    }

    try {
        await LikesComment.update({ count: getLikes.count + 1},{where: {commentId: id} });
    }
    catch (e) {
        console.log(e);
    }

    return res.status(200).json({ success: true, data: getLikes.count + 1,});
});

exports.updComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const verifyUser = await User.findOne({where: {id: req.user.id}});

    if ((verifyUser.id !== req.user.id)
        || (verifyUser.id !== req.user.id && verifyUser.role !== 'admin' )) {
        return next({
            message: `You have no permission to edit comment`,
            statusCode: 401,
        });
    }

    const updComment = await Comment.update({comment: req.body.comment}, {where: { id: id } })

    if (updComment[0] === 0) {
        return next({
            message: `Comment not found`,
            statusCode: 404,
        });
    }

    res.status(200).json({ success: true});
});

exports.delComment = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const verifyUser = await User.findOne({where: {id: req.user.id}});

    if ((verifyUser.id !== req.user.id)
        || (verifyUser.id !== req.user.id && verifyUser.role !== 'admin' )) {
        return next({
            message: `You have no permission to edit comment`,
            statusCode: 401,
        });
    }

    const del = await Comment.destroy({ where: { id: id } });

    if (del === 0) {
        return next({
            message: `Comment not found`,
            statusCode: 404,
        })
    }

    res.status(200).json({ success: true});
});

exports.delLikeComment = async (req, res) => {
    const { id } = req.params;
    const verifyUser = await User.findOne({where: {id: req.user.id}});
    const getLikes = await LikesComment.findOne({where: { commentId: id } });

    if (verifyUser.id) {
        const getLikes = await LikesComment.findOne({where: { commentId: id } });
        await LikesComment.update({ count: getLikes.count - 1},{where: {commentId: id} });
    }

    return res.status(200).json({ success: true, data: getLikes.count - 1});
}