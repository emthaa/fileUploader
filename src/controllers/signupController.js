const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function signupRouterGet(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      res.render("index", { user: null });
    } else {
      res.render("signup", { errors: null, data: null });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function signupRouterPost(req, res, next) {
    const { username, password } = req.body;
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", { errors: errors.array(), data: req.body });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
        },
      });
  
      // Check if user went into db
      if (!user) {
        throw new Error("Failed to insert user");
      }
  
      res.render("index", { user: null });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).render("signup", { errors: [{ msg: error.message }], data: req.body });
    }
  }

module.exports = {
  signupRouterGet,
  signupRouterPost,
};