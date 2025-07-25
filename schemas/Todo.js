const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 50,
        required: true,
    },
    description: {
        type: String,
        min: 3,
        max: 150,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    // User
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},
    { versionKey: false }
);

module.exports = mongoose.model("Todo", todoSchema);