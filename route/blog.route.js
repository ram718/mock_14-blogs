const express = require("express");
const blogRouter = express.Router();
const { BlogModel } = require("../model/blog.model");
const jwt = require("jsonwebtoken");

// Post API
blogRouter.post("", async (req, res) => {
  const paylaod = req.body;
  try {
    const data = new BlogModel(paylaod);
    await data.save();
    res.status(200).send({ msg: "Blog added successfully" });
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Get API
blogRouter.get("", async (req, res) => {
  const { page, limit, title, category, sort, order } = req.query;
  try {
    if (page && limit) {
      const current = (page - 1) * limit || 0;
      const data = await BlogModel.find().skip(current).limit(limit);
      res.status(200).send(data);
    } else if (title) {
      const data = await BlogModel.findOne({ title });
      res.status(200).send(data);
    } else if (category) {
      const data = await BlogModel.find({ category });
      res.status(200).send(data);
    } else if (sort && order) {
      if (order === "asc") {
        const data = await BlogModel.find().sort({ date: 1 });
        res.status(200).send(data);
      } else {
        const data = await BlogModel.find().sort({ date: -1 });
        res.status(200).send(data);
      }
    } else {
      const data = await BlogModel.find();
      res.status(200).send(data);
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Delete API
blogRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  const blog = await BlogModel.findOne({ _id: id });
  const userID_in_blog = blog.userID;
  try {
    if (userID_in_blog == decoded.userID) {
      await BlogModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ msg: "Blog is deleted" });
    } else {
      res.status(400).send({ msg: "Not Authorized" });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Patch API
blogRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "masai");
  const blog = await BlogModel.findOne({ _id: id });
  const userID_in_blog = blog.userID;
  try {
    if (userID_in_blog == decoded.userID) {
      await BlogModel.findByIdAndUpdate({ _id: id }, payload);
      res.status(200).send({ msg: "Blog is updated" });
    } else {
      res.status(400).send({ msg: "Not Authorized" });
    }
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Like API
blogRouter.patch("/:id/like", async (req, res) => {
  const { id } = req.params;
  const blog = await BlogModel.findOne({ _id: id });
  try {
    await BlogModel.findByIdAndUpdate({ _id: id }, { likes: blog.likes + 1 });
    res.status(200).send({ msg: "Like added" });
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

// Comment API
blogRouter.patch("/:id/comment", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const data = await BlogModel.findOne({ _id: id });
    data.comments.push(payload);
    await data.save();
    res.status(200).send({ msg: "Comment added" });
  } catch (err) {
    res.status(400).send({ msg: "Bad Request" });
  }
});

module.exports = { blogRouter };
