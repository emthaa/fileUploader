async function indexRouterGet(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      res.render("index", { user: req.user });
    }else{
      res.render("index", { user: null });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  indexRouterGet,
};
