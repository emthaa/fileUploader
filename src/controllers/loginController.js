const passport = require("passport");

function loginRouterGet(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("login", { errors: null, data: null });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

function loginRouterPost(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("login", {
        errors: [{ msg: info.message }],
        data: { username: req.body.username }
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
}

module.exports = {
  loginRouterGet,
  loginRouterPost,
};