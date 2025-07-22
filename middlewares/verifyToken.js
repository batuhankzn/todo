const jwt = require("jsonwebtoken");
const User = require("../schemas/User");

const verifyToken = async (req, res, next) => {
    // Önce header'dan, sonra cookie'den token almayı dene
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ message: "Token bulunamadı" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Geçersiz veya süresi dolmuş token" });
    }
};

module.exports = verifyToken;
