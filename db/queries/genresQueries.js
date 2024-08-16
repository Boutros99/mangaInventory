const pool = require("../pool");




// GET queries
async function getAllGenres() {
    const { rows } = await pool.query("SELECT * FROM GENRES");
    return rows;
  }

async function getGenre(id) {
  try {
    const { rows } = await pool.query("SELECT * FROM GENRES WHERE GENRES.id = $1", [id] );

    if (!rows || rows.length==0) {
      console.log('No Genre Found');
      return ;
    }
    console.log('Genre reached successfully');
    return rows[0];
  } catch (error) {
    console.error('Error accessing genre:', error);
  }
}


async function getMangasByGenre(genreID) {
  const { rows } = await pool.query(
    `SELECT M.*
     FROM MANGAS M
     JOIN MANGAS_GENRES MG ON M.id = MG.manga_id
     WHERE MG.genre_id = $1`,
    [genreID]
);
  return rows;
}

// used to populate the MANGAS_GENRES TABLE -- not used anymore
/*
async function getGenreIdFromName(genreName) {
  const { rows } = await pool.query("SELECT GENRES.id FROM GENRES WHERE GENRES.name= $1", [genreName] );
  return rows[0].id;
} 
*/

// Create Queries 


 async function doesGenreExist(name) {
  const { rows } =  await pool.query("SELECT * FROM GENRES WHERE GENRES.name = $1", [name] );
  return rows.length>0;
}

async function addNewGenre(name,description,image) {
  
  try {
    const {rows} = await pool.query('INSERT INTO GENRES (name,description,image) VALUES ($1,$2,$3) RETURNING id',[name,description,image])
    console.log(`Genre inserted successfully.`);
    return rows[0].id;
  } catch (error) {
    console.error('Error adding Genre:', error);
  }

}

// update queries
async function updateGenre (id, name, description, image) {
  const query = `
    UPDATE GENRES
    SET name = $1, description = $2, image= $3
    WHERE id = $4;
  `;
  const values = [name, description, image, id];
  try {
    await pool.query(query, values);
    console.log(`Genre with ID ${id} updated successfully.`);
  } catch (error) {
    console.error('Error updating genre:', error);
  }
};

// delete Queries
async function deleteGenre (id) {
  try {
    await pool.query('DELETE FROM GENRES WHERE GENRES.id = $1', [id]);
    console.log('Genre deleted successfully');
  } catch (error) {
    console.error('Error deleting Genre:', error);
  }
}

  
  module.exports = {
    getAllGenres,
    getGenre,
    getMangasByGenre,
    doesGenreExist,
    addNewGenre,
    updateGenre,
    deleteGenre
  };