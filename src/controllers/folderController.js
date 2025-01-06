const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createFolder(req, res) {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function listFolders(req, res) {
  const userId = req.user.id;

  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
    });
    res.render("index", { user: req.user, folders });
  } catch (error) {
    console.error("Error listing folders:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateFolder(req, res) {
  const { folderId, newName } = req.body;
  const userId = req.user.id;

  try {
    await prisma.folder.updateMany({
      where: {
        id: parseInt(folderId, 10),
        userId: userId,
      },
      data: {
        name: newName,
      },
    });
    res.redirect("/");
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteFolder(req, res) {
  const folderId = parseInt(req.body.folderId, 10);
  const userId = req.user.id;

  try {
    await prisma.folder.deleteMany({
      where: {
        id: folderId,
        userId: userId,
      },
    });
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createFolder,
  listFolders,
  updateFolder, 
  deleteFolder,
};