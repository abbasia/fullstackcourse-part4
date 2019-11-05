const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promises = blogObjects.map(object => object.save());
  await Promise.all(promises);
});

describe.skip("when there are initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body.length).toBe(helper.initialBlogs.length);
  });

  test("unique identifier should be id ", async () => {
    const response = await api.get("/api/blogs");
    const blogs = response.body;

    blogs.forEach(blog => {
      expect(blog["id"]).toBeDefined();
    });
  });
});
describe.skip("addition of a new blog", () => {
  test("new blog can be added", async () => {
    const newBlog = { title: "for testing", url: "something" };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).toContain("for testing");
  });

  test("new blog can be added without likes property ", async () => {
    const newBlog = { title: "for testing 0 likes", url: "something" };
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const savedBlog = response.body;
    expect(savedBlog.title).toBe("for testing 0 likes");
    expect(savedBlog.likes).toBe(0);
  });

  test("new blog cannot be created wihtout title and url property", async () => {
    const newBlog = { author: "" };
    await api.post("/api/blogs").expect(400);
  });
});

describe.skip("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1);
    console.log("blogToDelete", blogToDelete);
    const ids = blogsAtEnd.map(b => b.id);
    expect(ids).not.toContain(blogToDelete.id);
  });
});
describe("updating of a blog", () => {
  test("update likes", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: blogToUpdate.likes + 1 });

    expect(response.body.likes).toBe(blogToUpdate.likes + 1);
  });
});

afterAll(async () => {
  const result = await mongoose.connection.close();
  console.log("closing mongo connection");
});
