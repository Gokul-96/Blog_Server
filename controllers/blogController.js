const Blog = require("../models/Blog");

exports.getAllBlogs = async (req, res) => {
  const { category, author } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (author) filter.author = author;
  try {
    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error });
  }
};

exports.createBlog = async (req, res) => {
  const { title, category, content, image } = req.body;
  try {
    const blog = await Blog.create({
      title,
      category,
      content,
      image,
      author: req.user.name,
      userId: req.user._id,
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: "Failed to create blog", error });
  }
};


exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updated = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Failed to update blog", error });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    if (blog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await blog.remove();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete blog", error });
  }
};
