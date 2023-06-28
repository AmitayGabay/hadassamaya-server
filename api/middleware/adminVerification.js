const jwt = require("jsonwebtoken");

// seperate token gen and cookie creation to seperated funcs
const generateAccessTokenHeader = (req, res, admin) => {
    const accessToken = jwt.sign(
        { adminname: admin.adminname, _id: admin._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    res.setHeader("Authorization", accessToken);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");
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
        maxAge: 60 * 60 * 25 * 1000, // 25 hours
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

            generateAccessTokenHeader(req, res, decodedAdmin);
            req.admin = decodedAdmin;
            next();
        }
    );
};

const verifyAdmin = (req, res, next) => {
    const accessToken = req.headers.authorization;
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
    generateAccessTokenHeader,
    generateRefreshTokenCookie,
};
