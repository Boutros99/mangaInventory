#! /usr/bin/env node
require('dotenv').config();
const { Client } = require("pg");


const SQL = `


CREATE TABLE IF NOT EXISTS GENRES (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ) UNIQUE NOT NULL,
  description TEXT,
  image TEXT
);

CREATE TABLE IF NOT EXISTS MANGAS (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR ( 255 ) UNIQUE NOT NULL,
  description TEXT,
  status VARCHAR ( 15 ) ,
  publication_year INTEGER,
  author VARCHAR ( 255 ),
  image TEXT
);

CREATE TABLE IF NOT EXISTS MANGAS_GENRES (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  manga_id INTEGER REFERENCES MANGAS(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES GENRES(id) ON DELETE CASCADE,
  UNIQUE(manga_id, genre_id)
) ;


INSERT INTO GENRES (name, description, image) VALUES
('Shonen', 'A genre targeted primarily at young boys, usually with action-packed stories.', 'https://e0.pxfuel.com/wallpapers/659/7/desktop-wallpaper-weekly-shonen-jump-2016-cover-contest-entry-by-kentaropjj-anime-naruto-shonen-jump.jpg'),
('Seinen', 'A genre targeted primarily at adult men, often featuring darker themes.','https://cdnb.artstation.com/p/assets/images/images/076/717/503/large/shehryar-khan-seinen-poster.jpg?1717618229'),
('Shojo', 'A genre targeted primarily at young girls, often focusing on romance and relationships.','https://64.media.tumblr.com/f503bb37c99330763cd7d74452813077/e5f03974f45fe252-79/s1280x1920/d4107a9f1ceae64dbf12e7f27070e40403f3045e.jpg'),
('Mecha', 'A genre featuring robots, often in a military or action context.','https://wallpapers.com/images/high/mecha_-anime_-robot_-artwork-zxy2ouj8bq4mmkh5-2.png'),
('Comedy', 'A genre designed to make the audience laugh, with humor as its primary theme.','https://64.media.tumblr.com/1c05d75a86d1b0ea4c1301a93151c61a/tumblr_nfu2a0GjcE1qd7kpzo1_500.jpg')
ON CONFLICT (name) DO NOTHING ;


INSERT INTO MANGAS (title, description, status, publication_year, author, image) VALUES
('Naruto', 'A story about a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the village leader.', 'Completed', '1999', 'Masashi Kishimoto','https://cdn.europosters.eu/image/1300/posters/naruto-shippuden-group-i129089.jpg'),
('One Piece', 'The story follows Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.', 'Ongoing', '1997', 'Eiichiro Oda','https://w0.peakpx.com/wallpaper/363/230/HD-wallpaper-straw-hat-pirates-anime-one-piece.jpg'),
('Berserk', 'A dark and brooding story of revenge and struggle, set in a medieval fantasy world.', 'Ongoing', '1989', 'Kentaro Miura','https://prod-printler-front-as.azurewebsites.net/media/photo/154564.jpg?mode=pad&width=1200&rnd=0.0.1'),
('Rainbow', 'A hard-hitting tale of friendship and survival in a post-WWII juvenile detention center in Japan.', 'Completed', '2002', 'George Abe','https://www.arthipo.com/image/cache/catalog/poster/anime/700-1341/anime944-rainbow-manga-poster-print-sales-high-resolution-image-download-1000x1000h.webp'),
('Gurren Lagann', 'A story about humans fighting for survival using giant mecha, with themes of evolution and perseverance.', 'Completed', '2007', 'Kazuki Nakashima','https://i.etsystatic.com/31837752/r/il/369e62/3851707143/il_1140xN.3851707143_kcwy.jpg'),
('Gintama', 'A comedic series set in an alternate Edo period with aliens, focusing on the misadventures of a samurai and his friends.', 'Completed', '2003', 'Hideaki Sorachi','https://image.tmdb.org/t/p/original/8VMnLgySAMYk6dS0lAr71hcpgy4.jpg')
ON CONFLICT (title) DO NOTHING ;

INSERT INTO MANGAS_GENRES (manga_id, genre_id) VALUES
((SELECT id FROM MANGAS WHERE title = 'Naruto'), (SELECT id FROM GENRES WHERE name = 'Shonen')),
((SELECT id FROM MANGAS WHERE title = 'One Piece'), (SELECT id FROM GENRES WHERE name = 'Shonen')),
((SELECT id FROM MANGAS WHERE title = 'Berserk'), (SELECT id FROM GENRES WHERE name = 'Seinen')),
((SELECT id FROM MANGAS WHERE title = 'Rainbow'), (SELECT id FROM GENRES WHERE name = 'Seinen')),
((SELECT id FROM MANGAS WHERE title = 'Gurren Lagann'), (SELECT id FROM GENRES WHERE name = 'Mecha')),
((SELECT id FROM MANGAS WHERE title = 'Gurren Lagann'), (SELECT id FROM GENRES WHERE name = 'Shonen')),
((SELECT id FROM MANGAS WHERE title = 'Gintama'), (SELECT id FROM GENRES WHERE name = 'Comedy')),
((SELECT id FROM MANGAS WHERE title = 'Gintama'), (SELECT id FROM GENRES WHERE name = 'Shonen'))
ON CONFLICT (manga_id) DO NOTHING;

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    host: process.env.DB_HOST, // or wherever the db is hosted
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432 // The default port
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
