const showUpdateFormButton = document.getElementById('showUpdateFormButton');
const updateForm = document.getElementById('updateForm');
const cancelUpdateButton = document.getElementById('cancelUpdateButton');

// Show the form when the "Show Delete Form" button is clicked
showUpdateFormButton.addEventListener('click', () => {
    updateForm.style.display = 'block';
    deleteForm.style.display = 'none'; //declared in the other file
});

// Hide the form when the "Cancel" button is clicked it is not needed because of the a link in cancel, but it goes faster than the server side so its good to have both
cancelUpdateButton.addEventListener('click', () => {
    updateForm.style.display = 'none';
});