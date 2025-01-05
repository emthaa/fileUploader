const { Router } = require("express");
const logOutRouter = Router();

logOutRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Failed to log out");
    }
    res.redirect("/");
  });
});

module.exports = logOutRouter;
