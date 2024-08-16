const mangasQueries = require("../db/queries/mangasQueries");
const genresQueries = require("../db/queries/genresQueries");
const { body, validationResult } = require("express-validator");
const mangasGenresQueries = require("../db/queries/mangasGenresQueries");
const mangasGenresMiddlewares = require("../middlewares/mangasGenresMiddlewares.js");
const customValidator = require('../middlewares/customValidator');


// Manga Validator
const validateManga = [
    body("title").trim()
    .isLength({ min: 1, max: 255 }).withMessage(`Title lenght should be between 1 and 255 characters`)
    .escape(),
    body("description").trim().optional().escape(),
    body("author")
    .trim()
    .matches(/^[a-zA-Z\s]+$/).withMessage("Author name should contain only letters and spaces.")
    .isLength({ min: 1, max: 255 }).withMessage("Author name length should be between 1 and 255 characters")
    .escape(),
    body("image").optional({checkFalsy: true}).isURL().withMessage('Must be a valide URL')
    .custom(customValidator.isImageURL),
    
];




// get the main mangas page
async function getMangas(req, res) {

    try {
        const mangas = await mangasQueries.getAllMangas();
        console.log(`Manga accessed succesfully`);
        res.render("mangas", {
            mangas : mangas,
        });
      } catch (error) {
        console.error('Error accessing all Mangas:', error);
        return res.status(500).render('serverError');
      }
  };
  
// get the manga description view page
async function getManga(req, res) {
    let mangaID=parseInt(req.params.id);
    const error=req.query.error; //handle possibility that the delete or update password is wrong by checking the params
    const showDeleteElement = req.query.showDeleteElement === 'true'; //handle the showing of the delete form 
    const showUpdateElement = req.query.showUpdateElement === 'true'; //same for updateform
    let manga;
    let genres
    try {
        manga = await mangasQueries.getManga(mangaID);
        genres= await mangasQueries.getGenresOfManga(mangaID);
      } catch (error) {
        console.error('Error accessing the Manga or its related genres:', error);
        return res.status(500).render('serverError');
      }
    if (!manga) {
        return res.status(404).render('notFound')
    }
    res.render("manga" , {
        manga : manga,
        genres : genres,
        error : error ,
        showDeleteElement : showDeleteElement,
        showUpdateElement : showUpdateElement
    });
};


// controllers used when creating a manga, redirecting to the create form and creating data
async function createMangaGet(req, res) {
    let genres;
    try {
        genres = await genresQueries.getAllGenres();
      } catch (error) {
        console.error('Error accessing the genres', error);
        return res.status(500).render('serverError');
      }

    res.render("createManga" , {
        genres : genres
    });
};


async function createMangaPost (req, res)  { 

    // dealing with input mistakes from user

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).render("createManga", {
        errors: errors.array(),
    });
    }
    const { title,description,status,publicationYear,author, image,genresIDs } = req.body;
    const doesMangaExist = await mangasQueries.doesMangaExist(title);
    if (doesMangaExist) {
    return res.status(409).render("createManga", {
        errors : [{msg:"Manga Already Exists"}] //handled this way so the user sees the error on the rendeing
    })
    };


    // adding form data to tables 

    let inserteMangadID ; // defining it before the two try catch to use it in both

    try { //adding data to MANGAS table
    const publicationYearInt = parseInt(publicationYear, 10);
    inserteMangadID = await mangasQueries.addNewManga(title,description,status,publicationYearInt,author,image); // returns the id of the newly created manga
    } catch (error) {
    console.error('Error adding Manga:', error);
    return res.status(500).render('serverError');
    }

    try { //adding data to MANGAS_GENRES table
        await mangasGenresMiddlewares.addAllRelationships(inserteMangadID,genresIDs)
    } catch (error) {
    console.error('Error adding Manga & Genre relation:', error);
    return res.status(500).render('serverError');
    }
    res.redirect("/mangas");
}

// controllers used when updating a manga, redirecting to the create form and updating data
async function updateMangaGet(req, res) {
    let mangaID=parseInt(req.params.id);
    
    //check for password
    const  password = req.query.password;
    if (password !== process.env.DATA_MODIF_PASSWORD) {
      return res.redirect(`/mangas/${mangaID}?error=Invalid%20Password&showUpdateElement=true`);
    };

  //continue if password ok
    const manga = await mangasQueries.getManga(mangaID);
    if (!manga) {
        return res.status(404).render('notFound')
    }
    const genresOfManga= await mangasQueries.getGenresOfManga(mangaID);
    const mangaGenreIdList = genresOfManga.map(genre =>genre.id) ; //we retrieve only the list of genre.ID selected for the manga
    const allgenres = await genresQueries.getAllGenres();
    res.render("updateManga", {
      manga : manga,
      allgenres: allgenres,
      mangaGenreIdList:mangaGenreIdList
    })
  }



async function updateMangaPost(req, res) {

  // dealing with input mistakes 
  let mangaID=parseInt(req.params.id);
  const manga = await mangasQueries.getManga(mangaID);
  const errors = validationResult(req);

  const genresOfManga= await mangasQueries.getGenresOfManga(mangaID);
  const mangaGenreIdList = genresOfManga.map(genre =>genre.id) ; //we retrieve only the list of genre.ID selected for the manga
  const allgenres = await genresQueries.getAllGenres();

  if (!errors.isEmpty()) {
    return res.status(400).render("updateManga", {
      manga : manga,
      allgenres: allgenres,
      mangaGenreIdList:mangaGenreIdList,
      errors: errors.array(),
    });
    }

  // updating the table MANGA
  const { title,description,status,publicationYear,author, image ,genresIDs } = req.body;
  const publicationYearInt = parseInt(publicationYear, 10);
  try { 
    await mangasQueries.updateManga( mangaID, title,description,status,publicationYearInt,author,image);
    } catch (error) {
    console.error('Error updating Manga', error);
    return res.status(500).render('serverError');
    }


  //adding data to MANGAS_GENRES table
  try { 
    await mangasGenresMiddlewares.updateAllRelationships(mangaID,genresIDs)
    } catch (error) {
    console.error('Error updating Mangas & Genres relations:', error);
    return res.status(500).render('serverError');
}
  res.redirect(`/mangas/${mangaID}` );
}
  




// controller to delete a manga
async function deleteMangaPost(req, res) {
    const mangaID=parseInt(req.params.id);

    // check password
    const { password } = req.body;
    if (password !== process.env.DATA_MODIF_PASSWORD) {
      return res.redirect(`/mangas/${mangaID}?error=Invalid%20Password&showDeleteElement=true`);
    };

    // continue if ok
    try { 
        await mangasQueries.deleteManga(mangaID);
        res.redirect("/mangas")
        } catch (error) {
        console.error('Error deleting manga', error);
        return res.status(500).render('serverError');
        }
}






module.exports = {
    getMangas,
    getManga,
    createMangaGet,
    validateManga,
    createMangaPost,
    updateMangaPost,
    updateMangaGet,
    deleteMangaPost
};
