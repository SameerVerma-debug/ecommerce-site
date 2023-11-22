const layout = require("../layout");

const getError = (errors,prop) => {
  try{
    return errors.mapped()[prop].msg;
  }catch(err){
    return "";
  }
}

module.exports = ({ req , errors}) => {
  return layout({
    content: `<div>
    Your id is: ${req.session.userId}
    <form method="post">
      <h2>Sign Up</h2>
      <div>
        <label for="email">Email: </label>
        <input type="email" name="email" id="email" placeholder="Email" required>
        ${getError(errors,'email')}
      </div>
      <div>
        <label for="password">Password: </label>
        <input type ="password" name="password" id="password" placeholder="Password" required>
        ${getError(errors,'password')}
      </div>
      <div>
        <label for="confirm-password">Confirm Password: </label>
        <input type="password" name="confirmPassword" id="confirm-password" placeholder="Confirm Password" required>
        ${getError(errors,'confirmPassword')}
      </div>
      <button type="submit">Sign Up</button>
    </form>
  </div>
  `,
  });
};
