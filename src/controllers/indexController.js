const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function indexRouterGet(req, res, next) {
  try {
    if (req.isAuthenticated()) {
      const folders = await prisma.folder.findMany({
        where: { userId: req.user.id },
      });
      const files = await prisma.file.findMany({
        where: { folderId: null, userId: req.user.id },
      });
      res.render("index", { user: req.user, folders, files });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  indexRouterGet,
};
