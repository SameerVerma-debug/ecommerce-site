const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");
const cookieSession = require("cookie-session");
const app = express();

//Keys is used to encrypt the info inside cookie using passed key
//cookie-session is a middleware i.e it intersepts the request
app.use(
  cookieSession({
    keys: ["dwkbeiwbuhu872347"],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/signup", (req, res) => {
  res.send(`
  <div>
    <form method="post">
      <h2>Sign Up</h2>
      <div>
        <label for="email">Email: </label>
        <input type="email" name="email" id="email" placeholder="Email" required>
      </div>
      <div>
        <label for="password">Password: </label>
        <input type ="password" name="password" id="password" placeholder="Password" required>
      </div>
      <div>
        <label for="confirm-password">Confirm Password: </label>
        <input type="password" name="confirmPassword" id="confirm-password" placeholder="Confirm Password" required>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  </div>
  `);
});

//bodyParser acts as a middleware in express; first run this and then run the callback of the made request
app.post(
  "/signup",
  bodyParser.urlencoded({ extended: true }),
  async (req, res) => {
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
  }
);

app.get("/signout", (req, res) => {
  req.session = null; //forget the info about this user
  res.send("You are logged out");
});

app.get("/signin", (req, res) => {
  res.send(`
  <div>
    <form method="post">
      <h2>Sign In</h2>
      <div>
        <label for="email">Email: </label>
        <input type="email" name="email" id="email" placeholder="Email" required>
      </div>
      <div>
        <label for="password">Password: </label>
        <input type ="password" name="password" id="password" placeholder="Password" required>
      </div>
      <button type="submit">Sign In</button>
    </form>
  </div>
  `);
});

app.post(
  "/signin",
  bodyParser.urlencoded({ extended: true }),
  async (req, res) => {
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
  }
);

app.listen(3000, () => {
  console.log("Listening");
});
