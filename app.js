// app.js
require('dotenv').config();
const path = require('path');

const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const mangasRouter = require("./routes/mangasRouter");
const genresRouter = require("./routes/genresRouter");


// setting view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// enabling the use of static files, especially css
app.use(express.static(path.join(__dirname, 'public')));


// using routes
app.use("/", indexRouter);
app.use("/mangas", mangasRouter);
app.use("/genres", genresRouter);



// launching server

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));

