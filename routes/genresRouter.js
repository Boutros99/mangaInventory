const { Router } = require("express");
const genresController = require("../controllers/genresController");
const genresRouter = Router();

// view the whole genre page
genresRouter.get("/", genresController.getGenres);


// create one genre page
genresRouter.get("/create", genresController.createGenreGet);
genresRouter.post("/create", [genresController.validateGenre,genresController.createGenrePost]);


// view one genre page
genresRouter.get("/:id", genresController.getGenre);


// modify one genre page
genresRouter.get("/:id/update", genresController.updateGenreGet);
genresRouter.post("/:id/update", [genresController.validateGenre,genresController.updateGenrePost]);

// delete genre
genresRouter.post("/:id/delete", genresController.deleteGenrePost);


module.exports = genresRouter;
