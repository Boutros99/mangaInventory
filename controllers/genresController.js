const genresQueries = require("../db/queries/genresQueries");
const { body, validationResult } = require("express-validator");
const customValidator = require('../middlewares/customValidator');

// Genre Validator
const validateGenre = [
  body("genreName")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage(`Name length should be between 1 and 255 characters`)
    .escape(),
  
  body("genreDescription")
    .trim()
    .optional()
    .escape(), // Optional field, no further validation
  
  body("genreImage").trim()
    .optional({checkFalsy: true}) // If the field is empty, validation stops here
    .isURL().withMessage('Must be a valid URL') // Check if it's a valid URL
    .bail() // If URL check fails, stop further validation
    .custom(customValidator.isImageURL) // Custom validation if URL is valid
];


// get the main Genres page
async function getGenres(req, res) {
    const genres = await genresQueries.getAllGenres();
    res.render("genres", {
        genres : genres,
    });
  };
  
// get the Genre description view page
async function getGenre(req, res) {
    const genreID=parseInt(req.params.id);
    const error=req.query.error; //handle possibility that the delete or update password is wrong by checking the params
    const showDeleteElement = req.query.showDeleteElement === 'true'; //handle the showing of the delete form 
    const showUpdateElement = req.query.showUpdateElement === 'true'; //same for updateform
    
    let genre;
    let mangas;
    try {
      genre = await genresQueries.getGenre(genreID);
      mangas = await genresQueries.getMangasByGenre(genreID);
      } catch (error) {
        console.error('Error accessing the Genre or its related Mangas:', error);
        return res.status(500).render('serverError');
      }
    if (!genre) {
      return res.status(404).render('notFound')
    } ;

    res.render("genre" , {
        genre : genre,
        mangas : mangas,
        error : error ,
        showDeleteElement : showDeleteElement,
        showUpdateElement : showUpdateElement
    });
};


// controllers used when creating a Genre, redirecting to the create form and creating data
async function createGenreGet(req, res) {
    res.render("createGenre")
}
 


async function createGenrePost (req, res)  { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("createGenre", {
          errors: errors.array(),
        });
      }
      const { genreName, genreDescription, genreImage} = req.body;
      const doesGenreExist = await genresQueries.doesGenreExist(genreName);
      if (doesGenreExist) {
        return res.status(409).render("createGenre", {
            errors : [{msg:"Genre Already Exists"}] //handled this way so the user sees the error on the rendeing
        })
      };

      let insertedGenredID ;
      try {
      insertedGenredID = await genresQueries.addNewGenre(genreName,genreDescription,genreImage);
      } catch (error) {
        console.error('Error adding genre:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.redirect(`/genres/${insertedGenredID}`);
    }

// controllers used when updating a Genre, redirecting to the create form and updating data
async function updateGenreGet(req, res) {
  let genreID=parseInt(req.params.id);

  //check for password
  const  password = req.query.password;
  if (password !== process.env.DATA_MODIF_PASSWORD) {
    return res.redirect(`/genres/${genreID}?error=Invalid%20Password&showUpdateElement=true`);
  };

  //continue if password ok
  const genre = await genresQueries.getGenre(genreID);
  if (!genre) {
    return res.status(404).render('notFound')
  } ;
  res.render("updateGenre", {
    genre : genre
  })
}

async function updateGenrePost(req, res) {

  // dealing with input mistakes 
  let genreID=parseInt(req.params.id);
  const genre = await genresQueries.getGenre(genreID);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("updateGenre", {
      genre : genre,
      errors: errors.array(),
    });
  }
  // updating the genre 
  const { genreName, genreDescription, genreImage } = req.body;
  await genresQueries.updateGenre(genreID,genreName,genreDescription,genreImage);
  res.redirect(`/genres/${genreID}` );
}
  
// controller to delete a Genre
async function deleteGenrePost(req, res) {

    const genreID= parseInt(req.params.id);


    // check password
    const { password } = req.body;
    if (password !== process.env.DATA_MODIF_PASSWORD) {
      return res.redirect(`/genres/${genreID}?error=Invalid%20Password&showDeleteElement=true`);
    };
    // continue if ok 
    try {
      await genresQueries.deleteGenre(genreID);
      console.log('Genre Deleted succesfully')
      res.redirect("/genres")
      } catch (error) {
        console.error('Error deleting genre:', error);
        return res.status(500).json({ error: 'Internal server error' });
      };
}




module.exports = {
  getGenres,
  getGenre,
  createGenreGet,
  validateGenre,
  createGenrePost,
  updateGenrePost,
  updateGenreGet,
  deleteGenrePost
};
