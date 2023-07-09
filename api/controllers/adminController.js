const AdminModel = require("../models/adminModel");
const ClientModel = require("../models/clientModel");
const bcrypt = require("bcrypt");
const {
    generateAccessTokenCookie,
    generateRefreshTokenCookie,
} = require("../middleware/adminVerification");

const login = async (req, res) => {
    try {
        const admin = await AdminModel.findOne({ adminname: req.body.adminname });
        if (!admin) return res.status(404).json("Admin not found");
        const isCorrect = await bcrypt.compare(req.body.password, admin.password);
        if (!isCorrect) return res.status(401).json("Wrong adminname or password");
        generateAccessTokenCookie(req, res, admin);
        generateRefreshTokenCookie(req, res, admin);
        admin.password = "********";
        res.status(200).json(admin);
    } catch (e) {
        return res.status(500).json(`Login proccess failed ${e}`);
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("accessToken", {
            // maxAge: 1000, // required to avoid firefox 'cookie already exp' warnning
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        res.clearCookie("refreshToken", {
            // maxAge: 1000, // required to avoid firefox 'cookie already exp' warnning
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        return res.status(200).json("Admin logged out succesfully");
    } catch (e) {
        return res.status(500).json(`Logout proccess failed ${e}`);
    }

};


const getCurrentAdmin = async (req, res) => {
    try {
        const admin = await AdminModel.findOne({ adminname: req.admin.adminname });
        admin.password = "********";
        return res.status(200).json(admin);
    } catch (e) {
        return res.status(500).json(`Get current admin failed ${e}`);
    }
};

const getClients = async (req, res) => {
    try {
        const clients = await ClientModel.find({ isEdited: false }).sort({ _id: -1 });
        const editedClients = await ClientModel.find({ isEdited: true }).sort({ _id: -1 });
        return res.status(200).json({ clients: clients, editedClients: editedClients });
    } catch (e) {
        return res.status(500).json(`Failed to fetch clients ${e}`);
    }
};


const editClient = async (req, res) => {
    try {
        const client = await ClientModel.findOne({ _id: req.body.id });
        client.isEdited = true;
        await client.save();
        return res.status(200).json(client);
    } catch (e) {
        return res.status(500).json(`edit client failed ${e}`);
    }
};

const deleteClient = async (req, res) => {
    try {
        const deletedClient = await ClientModel.deleteOne({ _id: req.body.id });
        return res.status(200).json(deletedClient);
    } catch (e) {
        res.status(500).json("delete client failed " + e);
    }
};


module.exports = {
    login,
    logout,
    getCurrentAdmin,
    getClients,
    editClient,
    deleteClient
};
