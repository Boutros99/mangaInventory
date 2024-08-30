# MangaVault - Manga Inventory Website

**Link to the Website:** [MangaVault](https://mangavault.adaptable.app/)

## Purpose

MangaVault is a web application project designed to manage and organize information about manga series and their respective genres. The purpose goal was to provide an interface for storing, retrieving, updating, and deleting information related to manga collections.

## Features

- **Manga and Genre Management**: Store information about various mangas, including title, description, status, publication date, author, and associated genres.
  
- **CRUD Operations**: 
  - **Create**: Add new mangas and genres to the inventory.
  - **Read**: View detailed information about each manga and genre.
  - **Update**: Modify existing entries for mangas and genres. (need a password)
  - **Delete**: Remove mangas and genres from the database. (need a password)

- **Dynamic Genre Selection**: Users can select multiple genres when adding or updating a manga, utilizing a dynamic selection list that loads available genres from the database.

## Tech Stack

### Frontend
- **EJS (Embedded JavaScript)**
- **CSS**
- **JavaScript**

### Backend
- **Express JS**

### Database
- **PostgreSQL**



### Database Structure

- **Mangas** : mangas table
- **Genres** : genres table
- **Mangas_genres** : relationships between mangas and genres (many to many)


