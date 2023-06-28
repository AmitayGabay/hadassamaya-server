const ClientModel = require("../models/clientModel");

const createClient = async (req, res) => {
    try {
        const newClient = await ClientModel.create(req.body);
        newClient.isEdited = false;
        await newClient.save();
        return res.status(201).json(newClient);
    } catch (e) {
        return res.status(500).json(`Client creation failed ${e}`);
    }
};



module.exports = {
    createClient
};