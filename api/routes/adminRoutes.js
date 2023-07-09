const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
const { verifyAdmin } = require("../middleware/adminVerification");

router.post("/login", adminController.login);
router.delete("/logout", adminController.logout);
router.get("/get-current", verifyAdmin, adminController.getCurrentAdmin);
router.get("/get-clients", verifyAdmin, adminController.getClients);
router.put("/edit-client", verifyAdmin, adminController.editClient);
router.delete("/delete-client", verifyAdmin, adminController.deleteClient);

module.exports = router;