const showDeleteFormButton = document.getElementById('showDeleteFormButton');
const deleteForm = document.getElementById('deleteForm');
const cancelDeleteButton = document.getElementById('cancelDeleteButton');

// Show the form when the "Show Delete Form" button is clicked
showDeleteFormButton.addEventListener('click', () => {
    deleteForm.style.display = 'block';
    updateForm.style.display = 'none';
});

// Hide the form when the "Cancel" button is clicked it is not needed because of the a link in cancel, but it goes faster than the server side so its good to have both
cancelDeleteButton.addEventListener('click', () => {
    deleteForm.style.display = 'none';
});