const mangasQueries = require("../db/queries/mangasQueries");
const genresQueries = require("../db/queries/genresQueries");
const mangasGenresQueries = require("../db/queries/mangasGenresQueries");

// add all relationships 
async function addAllRelationships (mangaID,genresIDs) {
 for (const genreID of genresIDs) {
    await mangasGenresQueries.addNewRelationship(parseInt(mangaID),parseInt(genreID));
 }
};


// update all relationships 
async function updateAllRelationships (mangaID,genresIDs) {
   await mangasGenresQueries.deleteAllRelationshipsFromMangaID(mangaID)
   await addAllRelationships (mangaID,genresIDs);
}




module.exports = {
addAllRelationships,
updateAllRelationships
};
