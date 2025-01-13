const { Router } = require("express");
const signupRouter = Router();
const signupController = require("../controllers/signupController");
const { check, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

signupRouter.get("/signup", signupController.signupRouterGet);

signupRouter.post(
  "/signup",
  [
    check("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters")
      .matches(/^\w+$/)
      .withMessage(
        "Username must contain only letters, numbers, or underscores"
      )
      .custom(async (value) => {
        const user = await prisma.user.findUnique({
          where: { username: value },
        });
        if (user) {
          throw new Error("Username is already taken");
        }
      }),
    check("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
    check("confirmPassword")
      .trim()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
  ],
  signupController.signupRouterPost
);

module.exports = signupRouter;
