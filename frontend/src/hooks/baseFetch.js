export function baseFetch(url, method = "POST", postData = null) {
    const headers = {
        'Content-Type': 'application/json',
        // Include other headers if necessary, such as Authorization
    };

    const options = {
        method,
        headers,
        ...(postData && { body: JSON.stringify(postData) }),
    };

    return fetch("https://planar-effect-420508.de.r.appspot.com" + url, options);
}