const express = require('express');
const { check, validationResult } = require('express-validator');
const axios = require('axios');

const app = express();
app.use(express.json());

// Custom validator to check if URL points to an image
const isImageURL = async (url) => {
    try {
        const response = await axios.head(url);

        // Check the content type
        const contentType = response.headers['content-type'];

        if (contentType && contentType.startsWith('image/')) {
            return true; // It's an image
        } else {
            throw new Error('URL does not point to an image');
        }
    } catch (error) {
        throw new Error('Unable to validate the image URL');
    }
};


module.exports = {
    isImageURL
}