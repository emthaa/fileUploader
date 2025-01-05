
const { Router } = require("express");
const loginRouter = Router();
const loginController = require("../controllers/loginController");
const { check, validationResult } = require("express-validator");
loginRouter.get("/login", loginController.loginRouterGet);
loginRouter.post("/login", [
    check("username")
        .trim(),
    check("password")
        .trim(),
],loginController.loginRouterPost);

module.exports = loginRouter;