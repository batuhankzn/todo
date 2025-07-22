const express = require("express");
const router = express.Router();
const Todo = require("../schemas/Todo");
const verifyToken = require("../middlewares/verifyToken");

// Tüm todoları sadece giriş yapan kullanıcıya göre getir
router.get("/get", verifyToken, async (req, res) => {
    const todos = await Todo.find({ user: req.user.userId });
    res.json(todos);
});

// Belirli bir todo'yu sadece sahibi görebilir
router.get("/get/:id", verifyToken, async (req, res) => {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.userId });
    if (!todo) return res.status(404).json({ message: "Todo bulunamadı" });
    res.json(todo);
});

// Yeni todo eklerken user bilgisini ekle
router.post("/create", verifyToken, async (req, res) => {
    const todo = new Todo({
        ...req.body,
        user: req.user.userId
    });
    await todo.save();
    res.json(todo);
});

// Sadece kendi todo'sunu güncelleyebilir
router.patch("/update/:id", verifyToken, async (req, res) => {
    const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        req.body,
        { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo bulunamadı veya yetkiniz yok" });
    res.json(todo);
});

// Sadece kendi todo'sunu silebilir
router.delete("/delete/:id", verifyToken, async (req, res) => {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!todo) return res.status(404).json({ message: "Todo bulunamadı veya yetkiniz yok" });
    res.json(todo);
});

module.exports = router;

