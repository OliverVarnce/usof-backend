const passwordValidator = require('password-validator');

exports.passValidator = async (req, res, next) => {
    const schema = new passwordValidator();

    schema
        .is().min(6)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        //.has().uppercase(0)                              // Must have uppercase letters
        //.has().lowercase(0)                              // Must have lowercase letters
        //.has().digits(0)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123', 'qwerty']); // Blacklist these values

    const validPass = schema.validate(req.body.password);

    console.log(validPass);
    if (!validPass){
        return next({
            message: "password may have A-Z,a-z, 0-9, and >6 characters",
            statusCode: 200,
        });

    }
    next();
}
