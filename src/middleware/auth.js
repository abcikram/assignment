const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')


const authentication = function (req, res, next) {
    try {
        const token = req.headers["authorization"];

        if (!token) {
            return res.status(401).json({ status: false, message: "token must be present" });
        }

        let splitToken = token.split(" ");

        // token validation.
        if (!token) {
            return res.status(400).json({ status: false, message: "token must be present" });
        }

        else {
            jwt.verify(splitToken[1], process.env.JWT_SECRET_KEY, function (err, data) {
                if (err) {
                    return res.status(400).json({ status: false, message: err.message });
                } else {
                    req.userId = data._id;
                    req.roles = data.roles
                    let userExists = userModel.findOne({ _id: req.userId, isDeleted: false })

                    if (userExists) {
                        next();
                    }
                    else if (!userExists) {
                        return res.send({ message: "user data is already deleted" })
                    }
                }
            });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


module.exports = { authentication }

