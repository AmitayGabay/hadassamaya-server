const clientRoutes = require("./clientRoutes");
const adminRoutes = require("./adminRoutes");

// All main routes of the application
exports.routesInit = (app) => {
    app.use("/client", clientRoutes);
    app.use("/admin", adminRoutes);

    // Handle case of request to any wrong route
    app.use("", (req, res) => {
        res
            .status(404)
            .json({ msg_error: `Url: ${res.req.originalUrl} not found` });
    });
};



