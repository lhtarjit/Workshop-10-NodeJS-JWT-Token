const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();

// Parse JSON request bodies
app.use(bodyParser.json());

// Hard-coded user data
const users = [
  { username: "alice", password: "1234" },
  { username: "bob", password: "5678" },
];

// JWT secret key
const secretKey = "my_secret_key";

// Create a new user
app.post("/create-user", (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user to the list
  users.push({ username, password });

  res.status(201).json({ message: "User created successfully" });
});

// Login and return a JWT token
app.post("/login-user", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match
  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a new JWT token
  const token = jwt.sign({ username }, secretKey);

  res.json({ token });
});

// Validate a JWT token
app.get("/validate-user", (req, res) => {
  const token = req.header("authToken");

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    // Verify the JWT token
    jwt.verify(token, secretKey);

    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
