const express = require("express");
const router = express.Router();
const Todo = require("../schemas/Todo");

router.get("/get", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

router.get("/get/:id", async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
});

router.post("/create", async (req, res) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.json(todo);
});

router.patch("/update/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
});

router.delete("/delete/:id", async (req, res) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    res.json(todo);
});

module.exports = router;

