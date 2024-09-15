// Write your tests here
const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");

test("sanity", () => {
  expect(true).toBe(true);
});

// Set up to handle migrations & destroy test DB before/after each test
//this should be done for every test in the beginnning

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

describe("server is running", () => {
  describe("api running well", () => {
    it("displays successful message of 'API is running..' ", async () => {
      const res = await request(server).get("/");
      expect(res.body).toBe("API is running for your sanity");
    });
  });
});

describe("[POST] /register", () => {
  it("responds with a 201 status", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Brandon", password: "1234" });
    expect(res.status).toBe(201);
  });
  it("register and display new user", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "Brandon", password: "1234" });
    expect(res.body).toMatchObject({ id: 1, username: "Brandon" });
  });
});

describe("[POST] /login", () => {
  it("responds with a 200 status when posted correct", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "Brandon", password: "1234" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "Brandon", password: "1234" });
    expect(res.status).toBe(200);
  });
  it("respond with a token for register", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "Brandon", password: "1234" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "Brandon", password: "1234" });
    expect(res.body.token).toBeTruthy();
  });
});

describe("[GET] /", () => {
  it("responds with 200 status when successful", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "Brandon", password: "1234" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "Brandon", password: "1234" });
    expect(res.status).toBe(200);
  });
  it("responds with a 401 when login credentials arent valid", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "Brandon", password: "1234" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "NotBrandon", password: "wrongPass" });
    expect(res.status).toBe(401);
  });
});
