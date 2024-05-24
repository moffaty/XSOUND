async function changeHeader() {
    const response = await fetch('/whoami');
    const data = await response.json();
    console.log(data);
    if (data.role === 2) {
        const navMap = document.getElementById('nav-map');
        navMap.remove();
    }
}
changeHeader();
