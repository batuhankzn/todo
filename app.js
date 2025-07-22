const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();


const todoRoutes = require("./routes/todo");
const userRoutes = require("./routes/User");

const verifyToken = require("./middlewares/verifyToken");


app.use(express.json());
app.use(cookieParser());
app.use("/", todoRoutes);
app.use("/", userRoutes);

const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    // Sunucuyu burada başlatabilirsiniz
    app.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

