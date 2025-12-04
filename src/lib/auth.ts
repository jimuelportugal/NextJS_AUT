import { jwtDecode, JwtPayload } from "jwt-decode";

export const TOKEN_KEY = "accessToken";

interface CustomJwtPayload extends JwtPayload {
    sub: number;
    username: string;
    role: 'admin' | 'user';
}

function saveToken(token) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

function getToken() {
    if(typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
}

function logoutUser() {
    if(typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

function isAdmin() {
    const token = getToken();
    if (!token) return false;
    try {
        const payload = jwtDecode(token);
        return payload.role === 'admin';
    } catch (e) {
        return false;
    }
}

export { saveToken, getToken, logoutUser, isAdmin, CustomJwtPayload }