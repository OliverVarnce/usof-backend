const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.protect = async (req, res, next) => {
    if (!req.headers.authorization) {
        return next({
            message: "You need to be logged in to visit this route",
            statusCode: 401,
        });
    }
    try {
        const token = req.headers.authorization.replace("Bearer", "").trim();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            attributes: [
                "id",
                "full_name",
                "login",
                "email",
                "avatar"
            ],
            where: {
                id: decoded.id,
            },
        });

        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        next({
            message: "You need to be logged in to visit this route!",
            statusCode: 401,
        });
    }
};

exports.admin = async (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    }

    return next({
        message: "Authorization denied, only admins can visit this route",
        statusCode: 401,
    });
};
