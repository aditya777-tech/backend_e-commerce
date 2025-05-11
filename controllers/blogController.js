const Blog = require('../models/Blog');

// @desc    Get all blogs with pagination
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
      blogs
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private/Admin
// exports.createBlog = async (req, res) => {
//   try {
//     const { title, writer, image, content } = req.body;

//     if (!title || !writer || !content) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const newBlog = new Blog({ title, writer, image, content });
//     const saved = await newBlog.save();

//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create blog' });
//   }
// };




// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlog = async (req, res) => {
  try {
    const { title, writer, images, content } = req.body; // NOTICE: images (array), not (single) image

    if (!title || !writer || !content || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields or images' });
    }

    const newBlog = new Blog({ title, writer, images, content });
    const saved = await newBlog.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};



// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blog not found' });

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};
