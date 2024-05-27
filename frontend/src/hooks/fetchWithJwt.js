export function fetchWithJwt(url, method = "POST", postData = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(sessionStorage.getItem("jwtToken") && {
                Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
            }),
        },
        ...(postData && { body: JSON.stringify(postData) }),
    };

    // return fetch("https://planar-effect-420508.de.r.appspot.com" + url, options);
    // return fetch("http://localhost:5000" + url, options);
    return fetch("https://tripbuddy-h5d6vsljfa-de.a.run.app" + url, options);
}
