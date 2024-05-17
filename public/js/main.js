async function postFetch(url, body) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body) 
    })
    const data = await response.json();
    return data;
}