const { Router } = require("express");
const mangasController = require("../controllers/mangasController.js");
const mangasRouter = Router();

// view the whole items page
mangasRouter.get("/", mangasController.getMangas);

// create one item page
mangasRouter.get("/create", mangasController.createMangaGet);
mangasRouter.post("/create",[mangasController.validateManga,mangasController.createMangaPost]);

// view one item page
mangasRouter.get("/:id", mangasController.getManga);



// modify on item page
mangasRouter.get("/:id/update", mangasController.updateMangaGet);
mangasRouter.post("/:id/update", [mangasController.validateManga,mangasController.updateMangaPost]);

// delete item
mangasRouter.post("/:id/delete", mangasController.deleteMangaPost);


module.exports = mangasRouter;
