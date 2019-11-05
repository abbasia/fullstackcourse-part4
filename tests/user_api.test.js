const User = require("../models/user");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);
const helper = require("./test_helper");
describe("when there is initially one user in the db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: "root", password: "sekret" });
    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = { username: "asasd", name: "awais", password: "salainen" };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(user => user.username);
    expect(usernames).toContain(newUser.username);
  });
});

afterAll(async () => {
  const result = await mongoose.connection.close();
  console.log("closing mongo connection");
});
