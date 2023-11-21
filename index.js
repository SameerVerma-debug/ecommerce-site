const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require('./repositories/users');
const app = express();

app.get("/", (req, res) => {
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
app.post("/", bodyParser.urlencoded({extended : true}), async (req, res) => {
  const {email,password,confirmPassword} = req.body;
  const existingUser = await usersRepo.getOneBy({email});
  if(existingUser){
    res.send("Email already exists");
  }

  if(password !== confirmPassword){
    res.send("Passwords must match");
  }

  //Response to send when request is made
  usersRepo.create({email,password});
  res.send("Account Created");
});

app.listen(3000, () => {
  console.log("Listening");
});