const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createToken = (data) => {
    const jwtkey = process.env.JWT_SECRET_KEY
    return jwt.sign(data  , jwtkey)
}

const createUser = async (req, res) => {
    try {
        const { name, phone, email, password ,roles} = req.body;

        if (!name || !email || !password) return res.status(400).json("All field is required")

        let Checkuser = await userModel.findOne({ email })
        if (Checkuser) return res.status(400).json("User's email is already exist")


        //encrypted password
        const salt = await bcrypt.genSalt(10) //salt 10 characters
        const newPassword = await bcrypt.hash(password, salt)

        const Obj = {
            name: name,
            phone: phone,
            email: email,
            password: newPassword,
            roles : roles
        }

        let user = await new userModel(Obj)

        let userToken = createToken({ roles: user.roles,_id: user._id.toString() })

        user.token = userToken

        const registerUser = await user.save()

        res.status(200).json({ status: true, message: "User is register Successfully", data: registerUser })


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })
    }
}


const userLogin = async (req, res) => {
    try {
        const userData = await userModel.findOne({ email: req.body.email, isDeleted : false }) 
        if (!userData) {
            return res.status(404).json({
                status: false,
                message: "User data is not found Or Email is not match"
            })
        }
        
        const passwordMatch = await bcrypt.compare(req.body.password,userData.password)
        
        if (passwordMatch == false)
            return res.status(400).json({ status: false, message: "Please enter correct password" });

        res.status(200).json({
            status: true,
            message: "user Login Successfully",
            token : userData.token
        });


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })
    }
}
 
const viewUser = async (req, res) => {
    try {
        const data = await userModel.findOne({ _id: req.userId, isDeleted: false },
            { token: 0, isDeleted: 0, createdAt: 0, __v: 0, password: 0 }
        )
        if (!data) {
            return res.status(404).json({
                status: false,
                message: "User data is not found"
            })
        }
        res.status(200).json({
            status: true,
            message: "User data",
            data : data
        })

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })
    }
}

const userUpdate = async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        const Obj = {
            name: name,
            phone: phone,
            password: password
        }

        const userdata = await userModel.findOneAndUpdate({ _id: req.userId, isDeleted: false }, {
            $set : Obj
        }, { new: true }
        )

        if (!userdata) {
           return res.status(404).json({
                status: false,
                message: "User is not found",
            })
        }
        res.status(200).json({
            status: true,
            message: "User update profile successfully",
            data: userdata
        })


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })
    }
}

const userDelete = async (req, res) => {
    try {

        const deleteData = await userModel.deleteOne({ _id: req.userId, isDeleted: false })

        if (!deleteData) {
            return res.status(404).json({
                status: false,
                message: "User data is not found",
            })
        }
        res.status(200).json({
            status: true,
            message: "User delete profile successfully"
        })


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })
    }
}

module.exports = { createUser, userLogin, userUpdate, viewUser , userDelete }