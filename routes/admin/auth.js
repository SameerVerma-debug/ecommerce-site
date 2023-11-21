const express = require("express");
const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({req}));
});

//bodyParser acts as a middleware in express; first run this and then run the callback of the made request
router.post("/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    res.send("Email already exists");
  }

  if (password !== confirmPassword) {
    res.send("Passwords must match");
  }

  const user = await usersRepo.create({ email, password });
  req.session.userId = user.id; //Added by cookie-session
  res.send("Account Created");
});

router.get("/signout", (req, res) => {
  req.session = null; //forget the info about this user
  res.send("You are logged out");
});

router.get("/signin", (req, res) => {
  res.send(signinTemplate({req}));
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await usersRepo.getOneBy({ email });
  if (!existingUser) {
    return res.send("Email is not signed up");
  }

  const isValidUser = await usersRepo.matchPassword(
    existingUser.password,
    password
  );
  if (!isValidUser) {
    return res.send("Incorrect Password");
  }

  req.session.userId = existingUser.id;
  res.send("Successfully logged in");
});

module.exports = router;