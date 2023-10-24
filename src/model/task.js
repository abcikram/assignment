const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["inProgress", "completed"],
        default: "inProgress"
    },
    dueDate: {
        type: Date,
        required : true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('task', taskSchema);
