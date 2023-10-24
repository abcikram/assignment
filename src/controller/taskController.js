const task = require('../model/task')
const taskModel = require('../model/task')
const nodemailer = require('nodemailer')
const cron = require('node-cron')


const createTask = async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body
        if (!task || !dueDate) {
            return res.status(400).json({
                status: false,
                message :"task or dueDate is required"
            })
        }
        const Obj = {
            user_id: req.userId,
            title, description, status, dueDate
        }

        const addTask = await new taskModel(Obj).save()

        res.status(200).json({
            status: true,
            message: "Task is added successfully by user",
            data : addTask
        }) 
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        }) 
    }
}

const getTask = async (req, res) => {
    try {
        const view = await taskModel.find({ user_id: req.userId },{__v:0,updatedAt :0})

        if (view.length == 0) {
            return res.status(404).json({message: "user do not added task"})
        }

        res.status(200).json({ status: true, message: "user view task", data: view })
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })  
    }
}

const getParticularTask = async (req, res) => {
    try {
        const viewParticular = await taskModel.findOne({ user_id: req.userId , _id : req.params.id })

        if (!viewParticular) {
            return res.status(404).json({ message: "Data not found" })
        }

        res.status(200).json({ status: true, message: "User view particular task", data: viewParticular })
        
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        }) 
    }
}


const userUpdateTask = async (req, res) => {
    try {
        const { dueDate, status, title, description } = req.body;

        const Obj = {
            dueDate: dueDate,
            status: status,
            title: title,
            description : description
        }

        const updateData = await taskModel.findOneAndUpdate({ user_id: req.userId, _id : req.params.id }, {
            $set: Obj
        }, { new: true }
        )

        if (!updateData) {
            return res.status(404).json({
                status: false,
                message: "Task data is not found or UnAuthorize access",
            })
        }
        res.status(200).json({
            status: true,
            message: "User update the task successfully",
            data: updateData
        })


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })
    }
}

const userDeleteTask = async (req, res) => {
    try {

        const deleteData = await taskModel.deleteOne({ user_id: req.userId, _id: req.params.id })

        if (!deleteData) {
            return res.status(404).json({
                status: false,
                message: "Task data is not found or Unauthorize access",
            })
        }

        res.status(200).json({
            status: true,
            message: "User delete the task successfully",
        })


    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server Error !!",
            error: error.message
        })
    }
}


const sendNotificationEmail = (name, email ,tasktitle) => {
    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
        service: "Gmail", // Use your email service provider
        secureConnection: false,
        tls: {
            rejectUnauthorized: false,
        },
        auth: {
            user: "broy8929@gmail.com", // Admin's email address
            pass: "jgjrcqknuiscughb", // Admin's email password (You can use an "App Password" if available)
        },
    });

    // Email options
    const mailOptions = {
        from: "broy8929@gmail.com",
        to: email,
        subject: `Task notification due date ${tasktitle}`,
        text: `Name: ${name}\n your task is due , Please make sure to complete it`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res
                .status(500)
                .send("Oops! Something went wrong. Please try again later.");
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};



cron.schedule('*/10 * * * *', async () => {
    // Get tasks with due dates today or overdue
    
});

cron.schedule('* * * * *', async() => {
    const today = new Date();
    const overdueTasks = await taskModel.find({ dueDate: { $lte: today } }).populate({
        path: 'user_id',
        select: ["name", "email"]
    });

    for (const task of overdueTasks) {
        console.log("task ====>", task.user_id.name, task.user_id.email)
        sendNotificationEmail(task.user_id.name, task.user_id.email, task.title);
    }
    // Your code to run every 10 minutes goes here
    console.log('Cron job is running every 10 minutes');
});

module.exports = { userDeleteTask, userUpdateTask, createTask, getTask, getParticularTask}