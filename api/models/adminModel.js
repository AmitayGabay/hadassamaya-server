const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    adminname: { type: String, required: true },
    password: { type: String, required: true }
})

const AdminModel = mongoose.model("Admin", adminSchema);
AdminModel.syncIndexes();

module.exports = AdminModel;
