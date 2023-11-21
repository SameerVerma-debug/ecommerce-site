const layout = require("../layout");

module.exports = ({ req }) => {
  return layout({
    content: `<div>
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
  </div>`,
  });
};
