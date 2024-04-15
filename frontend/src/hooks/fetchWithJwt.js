export async function fetchWithJwt(url, method = 'POST', postData = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(sessionStorage.getItem('jwtToken') && { 'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}` }),
        },
        ...(postData && { body: JSON.stringify(postData) }),
    };

    return fetch(url, options);
}