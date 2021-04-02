require("dotenv").config();

const { Post, Category, PostTaxonomy, User } = require("../models");
const asyncHandler = require("../middlewares/asyncHandler");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const paginate = require('express-paginate');

exports.allCategories = async (req, res, next) => {
    if (!req.query.limit){
        req.query.limit = 2;
    }

    await Category.findAndCountAll(
        {
            limit: req.query.limit,
            offset: req.skip,
            order: [['id', 'ASC']],
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

exports.oneCategory = async (req, res, next) => {
    const oneCategory = await Category.findByPk(req.params.id);

    if (!oneCategory) {
        return next({
            message: `No categories found`,
            statusCode: 404,
        });
    }

    res.status(200).json({ success: true, data: oneCategory });
}

exports.categoryPosts = async (req, res) => {
    try {
        const postCats = await Post.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('name')), 'name'],
            ].concat(Object.keys(Post.rawAttributes)),
            exclude: ['name'],
            include: [
                {
                    model: PostTaxonomy,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: Category,
                            required: true,
                            attributes: [],
                            where: {id: req.params.id}
                        }],
                }],
        });
        return res.status(200).json({ success: true, data: postCats});
    } catch (e) {
        console.log(e);
        return res.status(500)
    }
}

exports.addCategory = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.replace("Bearer", "").trim();
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    const { title } = req.body;
    const verifyUser = await User.findOne({where: {id: userId.id}});

    if (!title) {
        return next({
            message: `title - is required parameter!`,
            statusCode: 400,
        });
    }

    const existsCategory = await Category.findOne({where: {name: title} });

    if (existsCategory) {
        return next({
            message: `Category exists`,
            statusCode: 400,
        });
    }

    if (verifyUser.id) {
        await Category.create({name: title});
    }

    res.status(200).json({ success: true});
});

exports.updCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { title } = req.body;
    const token = req.headers.authorization.replace("Bearer", "").trim();
    const userId = jwt.verify(token, process.env.JWT_SECRET);

    const verifyUser = await User.findOne({where: {id: userId.id}});

    if (verifyUser.role !== 'admin' ) {
        return next({
                message: `Authorization denied, only admins can visit this route`,
                statusCode: 400,
            });
    }

    const avalCat = await Category.findOne({where: { name: title}});

    if (avalCat) {
        return next({
            message: `Title is not unique!`,
            statusCode: 400,
        });
    }

    const updCategory = await Category.update({name: title}, {where: { id: id } })

    if (updCategory[0] === 0) {
        return next({
            message: `Category not found`,
            statusCode: 404,
        });
    }

    res.status(200).json({ success: true});
});

exports.delCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const token = req.headers.authorization.replace("Bearer", "").trim();
    const userId = jwt.verify(token, process.env.JWT_SECRET);

    const verifyUser = await User.findOne({where: {id: userId.id}});

    if (verifyUser.role !== 'admin' ) {
        return next({
            message: `Authorization denied, only admins can visit this route`,
            statusCode: 400,
        });
    }

    const delCat = await Category.destroy({where: { id: id }});

    if (delCat === 0) {
        return next({
            message: `Category not found!`,
            statusCode: 404,
        });
    }

    res.status(200).json({ success: true});
});