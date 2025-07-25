const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 3,
        max: 50,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    isVerifiedMail: {
        type: Boolean,
        default: false,
    },
    verifyMailCode: {
        type: String,
        default: null,
    },
    verifyMailCodeExpire: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

},
    { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);