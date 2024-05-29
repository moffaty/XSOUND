const usersButton = document.querySelector('#users');
if (usersButton) {
    usersButton.addEventListener('click', (e) => {
        window.location = '/admin/users';
    });
}

const venuesButton = document.querySelector('#venues');
if (venuesButton) {
    venuesButton.addEventListener('click', (e) => {
        window.location = '/admin/venues';
    });
}

const backButton = document.querySelector('#page');
if (backButton) {
    backButton.addEventListener('click', (e) => {
        window.location = '/admin/page';
    });
}