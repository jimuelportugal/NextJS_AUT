import { jwtDecode, JwtPayload } from "jwt-decode";

export const TOKEN_KEY = "accessToken";

interface CustomJwtPayload extends JwtPayload {
    sub: string;
    username: string;
    role: 'admin' | 'user';
}

function saveToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

function getToken(): string | null {
    if(typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
}

function logoutUser(): void {
    if(typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

function isAdmin(): boolean {
    const token = getToken();
    if (!token) return false;
    try {
        const payload: CustomJwtPayload = jwtDecode(token);
        return payload.role === 'admin';
    } catch (e) {
        return false;
    }
}

export { saveToken, getToken, logoutUser, isAdmin }
export type { CustomJwtPayload }