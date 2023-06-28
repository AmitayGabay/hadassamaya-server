const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: String,
    isEdited: { type: Boolean, default: false }
})

const ClientModel = mongoose.model("Client", clientSchema);
ClientModel.syncIndexes();

module.exports = ClientModel;
