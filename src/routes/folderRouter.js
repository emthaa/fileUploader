const { Router } = require("express");
const folderController = require("../controllers/folderController");
const folderRouter = Router();

folderRouter.post("/folders", folderController.createFolder);
folderRouter.get("/folders", folderController.listFolders);
folderRouter.post("/folders/edit", folderController.updateFolder); 
folderRouter.post("/folders/delete", folderController.deleteFolder);

module.exports = folderRouter;