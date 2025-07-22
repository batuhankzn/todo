const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Kayıt (register) endpoint'i
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tüm alanlar zorunludur" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Bu e-posta ile kullanıcı zaten var" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu" });
});

// Giriş (login) endpoint'i
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Alan kontrolü
    if (!email || !password) {
        return res.status(400).json({ message: "E-posta ve şifre zorunludur" });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Geçersiz şifre" });
    }

    // JWT token oluştur (örnek: 1 saat geçerli)
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1 * 60 * 60 * 1000 // 1 saat
    });

    // Kullanıcıya token ve temel bilgiler dön
    res.status(200).json({
        message: "Giriş başarılı",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

module.exports = router;