import React, { useContext, createContext } from "react";
import {cognitoUserPoolsTokenProvider} from "aws-amplify/auth/cognito";
import {CookieStorage} from "aws-amplify/utils";
import { Cookies } from "react-cookie-consent";

export const setCookieStorage = () =>{
    cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());
}

export const setSessionCookie = (name, value) => {
    Cookies.remove(name);
    if(name === 'geolocation' || name === 'credential') {
        Cookies.set(name, value, {sameSite: 'lax'});
    } else {
        Cookies.set(name, value, {expires: 7, sameSite: 'lax'});
    }
};

export const getSessionCookie = (name) => {
    const sessionCookie = Cookies.get(name);
    if (name === undefined || sessionCookie === undefined) {
        return {};
    } else {
        return sessionCookie;
    }
};

export const removeSessionCookie = (name) => {
    Cookies.remove(name);
}

// --- Post sign-in redirect ---------------------------------------------------
// The page a user should return to after signing in (e.g. a protected album).
// Only same-site relative paths are accepted, so a crafted link such as
// /sign-in?redirect=https://evil.example cannot send users off-site.
const POST_LOGIN_REDIRECT_KEY = 'postLoginRedirect';
const AUTH_PAGES = ['/sign-in', '/sign-up', '/reset-password'];

export const safeRedirectPath = (value) => {
    if (typeof value !== 'string' || value.length === 0) return '/';
    // must be a path on this site: starts with "/" but not "//" or "/\" (protocol-relative)
    if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/';
    // no point returning to an auth page after signing in
    const pathname = value.split(/[?#]/)[0];
    if (AUTH_PAGES.includes(pathname)) return '/';
    return value;
};

// Used by email/password sign-in, which has no OAuth customState to carry the route
export const savePostLoginRedirect = (value) => {
    if (typeof window === 'undefined') return;
    try {
        sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, safeRedirectPath(value));
    } catch (e) {
        // storage unavailable (e.g. privacy mode): fall back to the home page
    }
};

// Returns the saved redirect (or '') and clears it, so it is used only once
export const takePostLoginRedirect = () => {
    if (typeof window === 'undefined') return '';
    try {
        const value = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
        sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
        return value ? safeRedirectPath(value) : '';
    } catch (e) {
        return '';
    }
};

/*
export const setSessionStorage = (name, value) => {
    sessionStorage.removeItem(name);
    sessionStorage.setItem(name, JSON.stringify(value));
}

export const getSessionStorage = (name, value) => {
    const sessionStore = sessionStorage.getItem(name);
    if (name === undefined || sessionStore === undefined || sessionStore === null) {
        return {};
    } else {
        return JSON.parse(sessionStore);
    }
}
*/

export const SessionContext = createContext(getSessionCookie());

export function useSessionContext() {
    return useContext(SessionContext);
}