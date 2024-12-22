const mongo = require("mongoose");
const Schema = mongo.Schema;

const User = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },

});

module.exports = mongo.model("user", User);
