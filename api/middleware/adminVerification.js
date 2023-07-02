const jwt = require("jsonwebtoken");

const generateAccessTokenCookie = (req, res, admin) => {
    const accessToken = jwt.sign(
        { adminname: admin.adminname, _id: admin._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
        maxAge: 60 * 60 * 0.5 * 1000, // 30 minutes
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });
};

const generateRefreshTokenCookie = (req, res, admin) => {
    const refreshToken = jwt.sign(
        { adminname: admin.adminname, _id: admin._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "24h",
        }
    );

    res.cookie("refreshToken", refreshToken, {
        maxAge: 60 * 60 * 48 * 1000, // 48 hours
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });
};

const generatAccessTokenByRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("No token provided");

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedAdmin) => {
            if (err) return res.status(403).json("refresh token is expired");
            generateAccessTokenCookie(req, res, decodedAdmin);
            req.admin = decodedAdmin;
            next();
        }
    );
};

const verifyAdmin = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) return res.status(401).json("No token provided");

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedAdmin) => {
            if (err) generatAccessTokenByRefreshToken(req, res, next);
            else {
                req.admin = decodedAdmin;
                next();
            }
        }
    );
};

module.exports = {
    verifyAdmin,
    generateAccessTokenCookie,
    generateRefreshTokenCookie,
};
