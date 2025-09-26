export const setCookie = (name, value, minutes) => {
    let expires = "";
    if (minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

export const setCookieAccessToken = (accessToken) => {
    setCookie("accessToken", accessToken, 1 * 24 * 60); // Expire 1 hari / harus login daily
}

export const setCookieRefreshToken = (refreshToken) => {
    setCookie("refreshToken", refreshToken, 7 * 24 * 60); // Expire 7 hari
}

export const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const eraseCookie = (name) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};