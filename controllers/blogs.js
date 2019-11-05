const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs.map(blog => blog.toJSON()));
});

blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) {
      response.json(blog.toJSON());
    } else {
      response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;
    const { title, author, url, likes, userId } = body;

    const token = request.token;

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blog({ title, author, url, likes, user: user._id });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);

    await user.save();
    response.status(201).json(savedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete("/:id", async (request, response, next) => {
  try {
    const token = request.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const blog = await Blog.findById(request.params.id);
    if (blog) {
      console.log("blog.user", blog.user);
      console.log("decodedToken", decodedToken);
      console.log(typeof blog.user.toString(), typeof decodedToken.id);
      if (decodedToken.id === blog.user.toString()) {
        await blog.remove();
        return response.status(204).end();
      } else {
        return response
          .status(403)
          .json({ error: "entry can only be deleted by its creator." });
      }
    } else {
      return response.status(404).end();
    }
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put("/:id", async (request, response) => {
  try {
    const body = request.body;
    const { title, author, url, likes } = body;
    const blog = { title, author, url, likes };
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true
    });
    response.json(updatedBlog.toJSON());
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
