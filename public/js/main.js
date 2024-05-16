async function postFetch(url, body) {
    const response = await fetch('/map', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify() 
    })
    const data = await response.json();
    return data;
}