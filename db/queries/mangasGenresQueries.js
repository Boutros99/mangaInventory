const pool = require("../pool");

// add queries
async function addNewRelationship(manga_id,genre_id) {
    
    try {
      await pool.query('INSERT INTO MANGAS_GENRES (manga_id,genre_id) VALUES ($1,$2)',[manga_id,genre_id]);
      console.log('Relationship added successfully');
    } catch (error) {
      console.error('Error adding one relationship:', error);
    }
  }


// update queries : to do so  we create a function deleting all the relationships for a given manga_id
async function deleteAllRelationshipsFromMangaID (manga_id) {
  try {
    await pool.query('DELETE FROM MANGAS_GENRES WHERE manga_id = $1', [manga_id]);
    console.log('All relationships deleted successfully');
  } catch (error) {
    console.error('Error deleting all relationships:', error);
  }
}

  module.exports = {
    addNewRelationship,
    deleteAllRelationshipsFromMangaID
  };

