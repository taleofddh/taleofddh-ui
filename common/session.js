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
        Cookies.set(name, value, {sameSite: 'strict'});
    } else {
        Cookies.set(name, value, {expires: 7, sameSite: 'lax'});
    }
};

export const getSessionCookie = (name) => {
    const sessionCookie = Cookies.get(name);
    if (name === undefined || sessionCookie === undefined) {
        return {};
    } else {
        return JSON.parse(sessionCookie);
    }
};

export const removeSessionCookie = (name) => {
    Cookies.remove(name);
}

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