const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    subscriberId: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
        default: "IND"
    },
    city: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;