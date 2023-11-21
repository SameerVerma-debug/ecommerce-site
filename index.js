const express = require("express");
const bodyParser = require("body-parser");
const usersRepo = require("./repositories/users");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const app = express();

//Keys is used to encrypt the info inside cookie using passed key
//cookie-session is a middleware i.e it intersepts the request
app.use(
  cookieSession({
    keys: ["dwkbeiwbuhu872347"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authRouter); //Authentication Functionality

app.listen(3000, () => {
  console.log("Listening");
});