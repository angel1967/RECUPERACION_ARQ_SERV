const logger = require('../lib/logger')('users'); // Module Name Required
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const token = require("../lib/token");
const email = require("../lib/email")


const createUser = async (req, res) => {
    try {
        // Prepare new user data, generate confirmation code and encrypt password
        let userData = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            confirmationCode: token.create()
        };
        // Create a new user in the database
        await User.create(userData)
            .then((createdUser) => {
                logger.info(`[createUser] User ${createdUser.email} created with id: ${createdUser._id}`);
                
                //Send confirmation email
                email.sendConfirmationEmail(
                    userData.name,
                    userData.email,
                    userData.confirmationCode
                );
                res.status(200)
                    .json({
                        success: true,
                        createdUser
                    })
            })
            .catch((error) => {
                logger.error(`[createUser] User could not be created. ${error.message}`);
                res.status(400)
                    .json({
                        success: false,
                        error: error.message
                    })
            })
    }
    catch (error) {
        logger.error(`[createUser] ${error.message}`);
        res.status(500)
            .json({
                success: false,
                error: error.message
            })
    }
}

const confirmUser = async (req, res) => {
    try {
        // Get user from database based on confirmation code
        User.findOne({ confirmationCode: req.params.confirmationCode })
            .then((user) => {
                if (!user) {
                    logger.error(`[confirmUser] User not found.`);
                    res.status(404).json({
                        success: false,
                        error: "User not found"
                    })
                }
                else {
                    // Change user status to Active and update database
                    user.status = "Active";
                    User.findByIdAndUpdate(user._id, user)
                        .then((updatedUser) => {
                            logger.info(`[confirmUser] User confirmed: ${updatedUser._id}`);
                            res.status(200)
                                .json({
                                    success: true,
                                    user
                                })
                        })
                        .catch((error) => {
                            logger.error(`[confirmUser] User could not be confirmed. ${error.message}`);
                            res.status(400)
                                .json({
                                    success: false,
                                    error: error.message
                                })
                        })
                }
            })
            .catch((error) => {
                logger.error(`[confirmUser] User could not be confirmed. ${error.message}`);
                res.status(400)
                    .json({
                        success: false,
                        error: error.message
                    })
            })
    }
    catch (error) {
        logger.error(`[confirmUser] ${error}`);
        res.status(error.status || 500).json({ error });
    }
}






const authorizeUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // Check if authorization header exists
        if (!authHeader) {
            let message = "Missing authorization header."
            logger.error(`[authorizeUser] ${message}`);
            res.status(401).json({
                success: false,
                error: message
            });
        } else {
            //Decode header user and password
            const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
            const email = auth[0];
            const password = auth[1];

            // Check if user exists
            User.findOne({ email: email })
                .then(async (user) => {
                    if (!user) {
                        logger.error(`[authorizeUser] User not found.`);
                        res.status(404).json({
                            success: false,
                            error: "User not found"
                        })
                    }
                    else {
                        // Validate the supplied user password
                        const valid = await bcrypt.compare(password, user.password);
                        if (valid !== true) {
                            // User un-authorized
                            let message = "Password does not match"
                            res.status(401).json({
                                success: false,
                                error: message
                            });
                        }
                        else {
                            if (user.status !== 'Active') {
                                // User is not active
                                let message = "User is not active"
                                res.status(401).json({
                                    success: false,
                                    error: message
                                });
                            }
                            else {
                                // Authorized user
                                next();
                            }


                        }
                    }
                })
                .catch((error) => {
                    logger.error(`[authorizeUser] There was an error getting the user from database. ${error.message}`);
                    res.status(400)
                        .json({
                            success: false,
                            error: error.message
                        })
                })
        }
    }
    catch (error) {
        logger.error(`[authorizeUser] ${error}`);
        res.status(error.status || 500).json({ error });
    }
}


module.exports = {
    createUser,
    confirmUser,
    authorizeUser
}