const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

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
    const files = await prisma.file.findMany({
      where: { folderId: null, userId },
    });
    res.render("index", { user: req.user, folders, files });
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
    // Delete files associated with the folder
    await prisma.file.deleteMany({
      where: {
        folderId: folderId,
      },
    });

    // Delete the folder
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

async function viewFolder(req, res) {
  const folderId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
        userId: userId,
      },
    });

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    const files = await prisma.file.findMany({
      where: {
        folderId: folderId,
      },
    });

    res.render("folder", { user: req.user, folder, files });
  } catch (error) {
    console.error("Error viewing folder:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function uploadFile(req, res) {
  const folderId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    await prisma.file.create({
      data: {
        name: req.file.filename, // Store the unique file name
        originalName: req.file.originalname, // Store the original file name
        size: req.file.size, // Store the file size
        folderId: folderId,
        userId: userId,
      },
    });
    res.redirect(`/folders/${folderId}`);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function uploadRootFile(req, res) {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    await prisma.file.create({
      data: {
        name: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        folderId: null, // No folder
        userId: userId,
      },
    });
    res.redirect("/");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteFile(req, res) {
  const fileId = parseInt(req.body.fileId, 10);
  const userId = req.user.id;

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        userId: userId,
      },
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, "../../uploads", file.name);
    fs.unlinkSync(filePath);

    // Delete the file from the database
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    res.redirect(`/folders/${file.folderId}`);
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createFolder,
  listFolders,
  updateFolder,
  deleteFolder,
  viewFolder,
  uploadFile,
  uploadRootFile,
  deleteFile,
};
