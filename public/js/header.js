async function changeHeader() {
    const response = await fetch('/whoami');
    const data = await response.json();
    console.log(data);
    if (data.email) {
        const header = document.querySelector('.navbar-nav');
        const dropdown = header.querySelector('.dropdown');
        const reglink = header.querySelector('#join');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        const navlink = dropdown.querySelector('.nav-link');
        reglink.remove();
        dropdownMenu.remove();
        navlink.id = '';
        navlink.dataset.bsToggle = '';
        navlink.classList.remove('dropdown-toggle');
        navlink.textContent = 'Вернуться к профилю';
        navlink.href = '/settings';
        dropdown.classList.remove('dropdown');
    }
}
changeHeader();
