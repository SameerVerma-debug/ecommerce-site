const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
  checkEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async value => {
      const existingUser = await usersRepo.getOneBy({ value });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    }),

  checkPassword: check("password")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Length must be between 5 and 20 "),
  checkConfirmPassword: check("confirmPassword")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage("Length must be between 5 and 20 ")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match");
      }
    }),
};
