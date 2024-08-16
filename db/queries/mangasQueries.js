const pool = require("../pool");

//get queries

async function getAllMangas() {
    const { rows } = await pool.query("SELECT * FROM MANGAS");
    return rows;
  }
  
async function getManga(id) {
  try {
    const { rows } = await pool.query("SELECT * FROM MANGAS WHERE MANGAS.id = $1", [id] );

    if (!rows || rows.length==0) {
      console.log('No Manga Found');
      return ;
    }
    console.log('Manga reached successfully');
    return rows[0];
  } catch (error) {
    console.error('Error accessing Manga:', error);
  }
}
  



async function getGenresOfManga(MangaID) {
  const { rows } = await pool.query(
    `SELECT G.*
     FROM GENRES G
     JOIN MANGAS_GENRES MG ON G.id = MG.genre_id
     WHERE MG.manga_id = $1`,
    [MangaID]
  );
  return rows;
} 



// Create Queries
async function doesMangaExist(title) {
  const { rows } =  await pool.query("SELECT * FROM MANGAS WHERE MANGAS.title = $1", [title] );
  return rows.length>0;
}


async function addNewManga(title,description,status,publication_year,author,image) {
  try {
    const query = 'INSERT INTO MANGAS (title,description,status,publication_year,author,image) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id' ; // RETURNING ID is used to get the id and add it in MANGAS_GENRES table
    const {rows} = await pool.query(query,[title,description,status,publication_year,author,image]);
    console.log(`Manga inserted successfully.`);
    return rows[0].id;
  } catch (error) {
    console.error('Error adding Manga:', error);
  }
}

// update queries
async function updateManga (id, title,description,status,publication_year,author,image) {
  const query = `
    UPDATE MANGAS
    SET title = $1, description = $2, status =$3, publication_year=$4, author =$5, image =$6
    WHERE id = $7;
  `;
  const values = [ title,description,status,publication_year,author, image, id];
  try {
    await pool.query(query, values);
    console.log(`Manga with ID ${id} updated successfully.`);
  } catch (error) {
    console.error('Error updating Manga:', error);
  }
};


// delete Query
async function deleteManga (id) {
  try {
    await pool.query('DELETE FROM MANGAS WHERE MANGAS.id = $1', [id]);
    console.log('Manga deleted successfully');
  } catch (error) {
    console.error('Error deleting Manga:', error);
  }
}

  module.exports = {
    getAllMangas,
    getManga,
    getGenresOfManga,
    doesMangaExist,
    addNewManga,
    updateManga,
    deleteManga
  };