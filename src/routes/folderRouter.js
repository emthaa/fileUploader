const { Router } = require("express");
const folderController = require("../controllers/folderController");
const folderRouter = Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage: storage });

folderRouter.post("/folders", folderController.createFolder);
folderRouter.get("/folders", folderController.listFolders);
folderRouter.post("/folders/edit", folderController.updateFolder);
folderRouter.post("/folders/delete", folderController.deleteFolder);
folderRouter.get("/folders/:id", folderController.viewFolder);
folderRouter.post(
  "/folders/:id/upload",
  upload.single("uploaded_file"),
  folderController.uploadFile
);
folderRouter.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../uploads", filename);
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});

folderRouter.post("/files/delete", folderController.deleteFile);


module.exports = folderRouter;