const express = require("express");
const app = express();
require("dotenv").config();
const { connection } = require("./db");
const { userRouter } = require("./route/user.route");
const cors = require("cors");
const { auth } = require("./middleware/auth.middleware");
const { blogRouter } = require("./route/blog.route");

app.use(express.json());
app.use(cors());

app.use("", userRouter);
app.use(auth);
app.use("/blogs", blogRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(`App is running at port ${process.env.port}`);
  } catch (err) {
    console.log(err);
  }
});
